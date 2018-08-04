import React from 'react';
import { StyleSheet, Text, View, StatusBar, Dimensions, TextInput, Platform, ScrollView } from 'react-native';
import ToDo from "./ToDo"

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newToDo: ""
  };

  render() {
    const { newToDo } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>TODO LIST</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New Todo"}
            value={newToDo}
            onChangeText={this._controlNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
          />
          <ScrollView contentContainerStyle={styles.todos}>
            <ToDo />
          </ScrollView>
        </View>
      </View>
    );
  }
}

_controlNewTodo = text => {
  this.setState({
    newTodo: text
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3232B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    marginBottom: 80,
    fontWeight: "200"
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  todos: {
    alignItems: "center"
  }
});