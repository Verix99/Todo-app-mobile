import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
  Platform,
} from "react-native";
import Task from "./Task";
import { useState, useRef } from "react";
import { TasksPageProps, TodoList, Todo } from "../.expo/types/index";

export default function TasksPage(props: TasksPageProps) {
  const [newTask, setNewTask] = useState<string>("");
  const [tasks, setTasks] = useState<TodoList[]>(props.data);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [remain, setRemain] = useState<number>(
    props.list.todos.filter((todo) => todo.completed).length
  );
  const flatListRef = useRef<FlatList | null>(null);
  const [remai, setRemai] = useState<number>(props.completed + props.remaining);

  const addTask = (): void => {
    if (newTask.trim() === "") {
      return;
    }

    const listIndex = tasks.findIndex((list) => list.name === props.list.name);
    if (listIndex !== -1) {
      const taskExists = tasks[listIndex].todos.some(
        (task) => task.title === newTask
      );
      if (taskExists) {
        alert("Úkol se stejným názvem již existuje");
        setNewTask("");
        return;
      }

      const updatedTasks = [...tasks];
      updatedTasks[listIndex].todos.push({
        title: newTask,
        completed: false,
      });
      setTasks(updatedTasks);
      setNewTask("");
      setRemai(remai + 1);
    } else {
      alert("Seznam úkolů nebyl nalezen");
    }
  };

  const toggleTaskCompleted = (taskTitle: string): void => {
    const listIndex = tasks.findIndex((list) => list.name === props.list.name);
    if (listIndex !== -1) {
      const taskIndex = tasks[listIndex].todos.findIndex(
        (task) => task.title === taskTitle
      );
      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[listIndex].todos[taskIndex].completed =
          !updatedTasks[listIndex].todos[taskIndex].completed;
        setTasks(updatedTasks);
        setRemain(
          updatedTasks[listIndex].todos[taskIndex].completed
            ? remain + 1
            : remain - 1
        );
      }
    }
  };

  const deleteTask = (title: string): void => {
    const taskIndex = props.list.todos.findIndex(
      (task) => task.title === title
    );
    if (taskIndex >= 0) {
      const taskCompleted = props.list.todos[taskIndex].completed;
      const newTodos = [...props.list.todos];
      newTodos.splice(taskIndex, 1);
      props.list.todos = newTodos;
      if (taskCompleted) {
        setRemain(remain - 1);
      }
      setRemai(remai - 1);
    }
  };

  const editTask = (oldTitle: string, newTitle: string): void => {
    const listIndex = tasks.findIndex((list) => list.name === props.list.name);
    if (listIndex !== -1) {
      const taskIndex = tasks[listIndex].todos.findIndex(
        (task) => task.title === oldTitle
      );
      const taskExists = tasks[listIndex].todos.some(
        (task) => task.title === newTitle
      );

      if (taskExists) {
        alert("Úkol se stejným názvem již existuje");
        return;
      }

      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[listIndex].todos[taskIndex].title = newTitle;
        setTasks(updatedTasks);
      } else {
        alert("Úkol nebyl nalezen");
      }
    } else {
      alert("Seznam úkolů nebyl nalezen");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={props.closeModal} style={styles.closeBtn}>
          <Image
            source={{
              uri: "https://img.icons8.com/ios-filled/50/delete-sign--v1.png",
            }}
            height={35}
            width={35}
          />
        </TouchableOpacity>
        <View
          style={[styles.titleContainer, { borderBottomColor: props.color }]}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>{props.list.name}</Text>
            <Text style={styles.tasksNumber}>
              {remain} z {remai} splněno
            </Text>
          </View>
        </View>
        <FlatList
          ref={flatListRef}
          showsVerticalScrollIndicator={false}
          data={props.list.todos}
          keyExtractor={(item: Todo, index: number) => index.toString()}
          renderItem={({ item }: { item: Todo }) => (
            <Task
              title={item.title}
              check={item.completed}
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
              editTask={editTask}
              onEditStart={() => {
                setIsEditing(true);
                const index = props.list.todos.findIndex(
                  (todo) => todo.title === item.title
                );
                if (index !== -1) {
                  flatListRef.current?.scrollToIndex({ index, animated: true });
                }
              }}
              onEditEnd={() => setIsEditing(false)}
            />
          )}
        />
        {!isEditing && (
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <TextInput
              style={[styles.input, { borderColor: props.color }]}
              placeholder="Napiš nový úkol..."
              placeholderTextColor="gray"
              value={newTask}
              onChangeText={setNewTask}
            />
            <TouchableOpacity
              onPress={() => addTask()}
              style={[styles.button, { backgroundColor: props.color }]}
            >
              <Image
                source={{ uri: "https://img.icons8.com/android/24/plus.png" }}
                height={30}
                width={30}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 32,
    top: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 5,
    fontWeight: "bold",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 4,
    borderRadius: 0,
    marginTop: 30,
  },
  tasksNumber: {
    fontSize: 16,
    marginBottom: 15,
    color: "grey",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "purple",
    borderWidth: 1,
    width: 250,
    marginBottom: 0,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 60,
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
  },
});
