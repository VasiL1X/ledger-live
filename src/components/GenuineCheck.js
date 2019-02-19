// @flow

import React, { PureComponent } from 'react'
import { timeout } from 'rxjs/operators/timeout'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate, Trans } from 'react-i18next'
import { delay, createCancelablePolling } from 'helpers/promise'

import logger from 'logger'
import type { T, Device } from 'types/common'
import manager from '@ledgerhq/live-common/lib/manager'
import type { DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'

import { GENUINE_TIMEOUT, DEVICE_INFOS_TIMEOUT, GENUINE_CACHE_DELAY } from 'config/constants'

import { getCurrentDevice } from 'reducers/devices'
import {
  CantOpenDevice,
  DeviceNotGenuineError,
  DeviceGenuineSocketEarlyClose,
  UnexpectedBootloader,
} from '@ledgerhq/errors'

import getDeviceInfo from 'commands/getDeviceInfo'
import getIsGenuine from 'commands/getIsGenuine'

import DeviceInteraction from 'components/DeviceInteraction'
import Text from 'components/base/Text'

import IconUsb from 'icons/Usb'
import IconHome from 'icons/Home'
import IconCheck from 'icons/Check'

type Props = {
  t: T,
  onFail?: Error => void,
  onUnavailable?: Error => void,
  onSuccess: (*) => void,
  device: ?Device,
}

const usbIcon = <IconUsb size={16} />
const homeIcon = <IconHome size={16} />
const genuineCheckIcon = <IconCheck size={16} />

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

const Bold = props => <Text ff="Open Sans|SemiBold" {...props} />

// to speed up genuine check, cache result by device id
const genuineDevices = new WeakSet()

class GenuineCheck extends PureComponent<Props> {
  connectInteractionHandler = () =>
    createCancelablePolling(() => {
      const { device } = this.props
      if (!device) return Promise.reject()
      return Promise.resolve(device)
    })

  checkDashboardInteractionHandler = ({ device }: { device: Device }) =>
    createCancelablePolling(
      () =>
        getDeviceInfo
          .send({ devicePath: device.path })
          .pipe(timeout(DEVICE_INFOS_TIMEOUT))
          .toPromise(),
      {
        shouldThrow: (err: Error) => {
          const isCantOpenDevice = err instanceof CantOpenDevice
          return isCantOpenDevice
        },
      },
    )

  checkGenuineInteractionHandler = async ({
    device,
    deviceInfo,
  }: {
    device: Device,
    deviceInfo: DeviceInfo,
  }) => {
    if (deviceInfo.isBootloader) {
      logger.log('device is in bootloader mode')
      throw new UnexpectedBootloader()
    }

    if (deviceInfo.isOSU) {
      logger.log('device is in update mode. skipping genuine')
      return true
    }

    // Preload things in parallel
    Promise.all([
      // Step dashboard, we preload the applist before entering manager while we're still doing the genuine check
      manager.getAppsList(deviceInfo),
      // we also preload as much info as possible in case of a MCU
      manager.getLatestFirmwareForDevice(deviceInfo),
    ]).catch(e => {
      logger.warn(e)
    })

    if (genuineDevices.has(device)) {
      logger.log("genuine was already checked. don't check again")
      await delay(GENUINE_CACHE_DELAY)
      return true
    }

    const beforeDate = Date.now()

    const res = await getIsGenuine
      .send({ devicePath: device.path, deviceInfo })
      .pipe(timeout(GENUINE_TIMEOUT))
      .toPromise()

    logger.log(`genuine check resulted ${res} after ${(Date.now() - beforeDate) / 1000}s`, {
      deviceInfo,
    })
    if (!res) {
      throw new DeviceGenuineSocketEarlyClose()
    }
    const isGenuine = res === '0000'
    if (!isGenuine) {
      throw new DeviceNotGenuineError()
    }
    genuineDevices.add(device)
    return true
  }

  handleFail = (err: Error) => {
    const { onFail, onUnavailable } = this.props
    if (err instanceof DeviceNotGenuineError) {
      onFail && onFail(err)
    } else {
      onUnavailable && onUnavailable(err)
    }
  }

  render() {
    const { onSuccess, device, ...props } = this.props
    const steps = [
      {
        id: 'device',
        title: (
          <Trans i18nKey="deviceConnect.step1" parent="div">
            {'Connect your'}
            <Bold>{'Ledger device'}</Bold>
            {'to your computer and enter your'}
            <Bold>{'PIN code'}</Bold>
            {'on your device'}
          </Trans>
        ),
        icon: usbIcon,
        run: this.connectInteractionHandler,
      },
      {
        id: 'deviceInfo',
        title: (
          <Trans i18nKey="deviceConnect.dashboard" parent="div">
            {'Go to'}
            <Bold>{'Home screen'}</Bold>
            {'on your device'}
          </Trans>
        ),
        icon: homeIcon,
        run: this.checkDashboardInteractionHandler,
      },
      {
        id: 'isGenuine',
        title: (
          <Trans i18nKey="deviceConnect.step3" parent="div">
            {'Confirm'}
            <Bold>{'Authentication'}</Bold>
            {'on your device'}
          </Trans>
        ),
        icon: genuineCheckIcon,
        run: this.checkGenuineInteractionHandler,
      },
    ]

    return (
      <DeviceInteraction
        key={device ? device.path : null}
        {...props}
        waitBeforeSuccess={500}
        steps={steps}
        onSuccess={onSuccess}
        onFail={this.handleFail}
      />
    )
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
)(GenuineCheck)
