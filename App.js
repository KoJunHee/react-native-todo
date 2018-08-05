import React from 'react';
import {
  StyleSheet, Text, View, StatusBar,
  Dimensions, TextInput, Platform, ScrollView, AsyncStorage
} from 'react-native';
import ToDo from "./ToDo"
import { AppLoading } from "expo"
import uuidv1 from "uuid/v1"

const { height, width } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: "",
    loadedTodos: false,
    todos: {}
  };

  componentDidMount = () => {
    this._loadTodos();
  }

  render() {
    const { newTodo, loadedTodos, todos } = this.state;

    if (!loadedTodos) {
      return <AppLoading />
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Junhee TODO LIST</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New Todo"}
            value={newTodo}
            onChangeText={this._controlNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addTodo}
            underlineColorAndroid={"transparent"}
          />
          <ScrollView contentContainerStyle={styles.todos}>
            {Object.values(todos)
              .reverse()
              .map(toDo => (
                <ToDo
                  key={toDo.id}
                  deleteTodo={this._deleteTodo}
                  uncompleteTodo={this._uncompleteTodo}
                  completeTodo={this._completeTodo}
                  updateTodo={this._updateTodo}
                  {...toDo}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewTodo = text => {
    this.setState({
      newTodo: text
    });
  };

  _loadTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      const parsedTodos = JSON.parse(todos);
      this.setState({
        loadedTodos: true,
        todos: parsedTodos || {}

      });
    } catch (err) {
      console.log(err);
    }

  };

  _addTodo = () => {
    const { newTodo } = this.state;
    if (newTodo !== "") {
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newTodo: "",
          todos: {
            ...prevState.todos,
            ...newTodoObject
          }
        };
        this._saveTodos(newState.todos);
        return { ...newState };
      });
    }
  };

  _deleteTodo = (id) => {
    this.setState(prevState => {
      const todos = prevState.todos;
      delete todos[id];
      const newState = {
        ...prevState,
        ...todos
      };
      this._saveTodos(newState.todos);
      return { ...newState };
    })
  };

  _uncompleteTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: false
          }
        }
      };
      this._saveTodos(newState.todos);
      return { ...newState };
    });
  };

  _completeTodo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            isCompleted: true
          }
        }
      };
      this._saveTodos(newState.todos);
      return { ...newState };
    });
  };

  _updateTodo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        todos: {
          ...prevState.todos,
          [id]: {
            ...prevState.todos[id],
            text: text
          }
        }
      };
      this._saveTodos(newState.todos);
      return { ...newState };
    });
  };

  _saveTodos = newTodos => {
    const saveTodos = AsyncStorage.setItem("todos", JSON.stringify(newTodos));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E9AFE',
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