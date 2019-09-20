import styled from 'react-emotion'
import React, { Component } from 'react'
import { injectWeb3 } from 'authereum'
import Button from '../Forms/Button'
import { GlobalConsumer } from '../../GlobalState'
import { WALLET_MODAL } from '../../modals'

import { ReactComponent as AuthereumImage } from '../svg/authereum.svg'
import { ReactComponent as ULImage } from '../svg/ul.svg'
import { ReactComponent as MetaMaskImage } from '../svg/metamask.svg'

const WalletsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`
const TitleContainer = styled('h3')`
  text-align: center;
`
const LogoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  height: 140px;
  margin-right: 10px;
  margin-left: 10px;
  @media (max-width: 576px) {
    width: 85px;
    height: 85px;
    margin-bottom: 25px;
    margin-right: 0px;
    margin-left: 0px;
  }
`
const AuthereumLogo = styled(AuthereumImage)`
  max-height: 75px;
  max-width: 75px;
  height: 100px;
  margin-bottom: 5px;
`
const ULLogo = styled(ULImage)`
  max-height: 75px;
  max-width: 75px;
  height: 100px;
  margin-bottom: 5px;
`
const MetaMaskLogo = styled(MetaMaskImage)`
  max-height: 75px;
  max-width: 75px;
  height: 100px;
  margin-bottom: 5px;
`
const LogoButton = styled(Button)`
  width: 150px;
`

export default class WalletModal extends Component {
  constructor() {
    super()
    this.state = {
      isMetamask: this.isMetamask()
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  authereumInit = async (networkState, signIn) => {
    window.sessionStorage.setItem('walletSelection', 'authereum')
    await injectWeb3(networkState.networkState.networkName.toLowerCase())
    window.ethereum.enable()
    window.ethereum.isMetaMask = false

    let didCloseModal = false
    while (didCloseModal === false) {
      // Wait a reasonable amount of time to see if the popup has closed
      await this.sleep(2500)
      didCloseModal = await signIn()
    }
  }
  ulInit = async () => {
    window.sessionStorage.setItem('walletSelection', 'universalLogin')
    console.log('TODO')
  }
  metamaskInit = async signIn => {
    window.sessionStorage.setItem('walletSelection', 'metaMask')
    await window.ethereum.enable()
    await signIn()
  }

  isMetamask = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      return true
    }
    return false
  }
  render() {
    return (
      <GlobalConsumer>
        {({ signIn, closeModal, networkState }) => (
          <>
            <TitleContainer>Choose your wallet</TitleContainer>
            <WalletsContainer>
              <LogoContainer>
                <AuthereumLogo />
                <LogoButton
                  onClick={() => {
                    this.authereumInit({ networkState }, signIn)
                    closeModal({ name: WALLET_MODAL })
                  }}
                >
                  Authereum
                </LogoButton>
              </LogoContainer>
              {/* <LogoContainer>
                <ULLogo />
                <LogoButton
                  onClick={() => {
                    this.authereumInit({ networkState })
                    closeModal({ name: WALLET_MODAL })
                  }}
                >
                  Universal Login
                </LogoButton>
              </LogoContainer> */}
              {this.state.isMetamask && (
                <>
                  <LogoContainer>
                    <MetaMaskLogo />
                    <LogoButton
                      onClick={async () => {
                        await this.metamaskInit(signIn)
                        closeModal({ name: WALLET_MODAL })
                      }}
                    >
                      MetaMask
                    </LogoButton>
                  </LogoContainer>
                </>
              )}
            </WalletsContainer>
          </>
        )}
      </GlobalConsumer>
    )
  }
}