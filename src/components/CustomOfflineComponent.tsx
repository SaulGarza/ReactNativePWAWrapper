import * as React from 'react'
import {
  Text,
  View,
} from 'react-native'

import styles from '../styles'

interface IProps {

}
interface IState {
}
export default class OfflineComponent extends React.PureComponent<IProps, IState> {
  public state: IState = { // Set initial state
  }
  constructor(props: IProps) {
    super(props)
    this.state = { // apply props to state { myKey: props.myKey }

    }
  }
  render() {
    return (
      <View style={(styles as any)().errorTextContainer}>
        <Text style={(styles as any)().errorText}>Could not connect to Server</Text>
      </View>
    )
  }
}
