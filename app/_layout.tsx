import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from "react-native";
import { useState } from "react";
import { TodoList as TodoListType } from "../.expo/types";
import TodoList from "../components/TodoList";
import NewList from "../components/NewList";
import testData from "../testData";

export default function RootLayout() {
  const [addTodoVisible, setAddTodoVisible] = useState<boolean>(false);
  const [data, setData] = useState<TodoListType[]>(testData);

  const openModal = (): void => {
    setAddTodoVisible(true);
  };

  const closeModal = (): void => {
    setAddTodoVisible(false);
  };

  const deleteItem = (index: number): void => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const addItem = (item: TodoListType): void => {
    if (data.some((existingItem) => existingItem.name === item.name)) {
      alert("Seznam úkolů se stejným názvem již existuje.");
      return;
    }
    setData((prevData) => [...prevData, item]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.logoBorder}>
          <Text style={styles.logo}>
            To<Text style={[styles.logo, { color: "blue" }]}>Do</Text>
          </Text>
        </View>
        <Text style={{ bottom: 10, fontSize: 17 }}>
          Přehledně, všude, vždycky
        </Text>
        <View style={styles.todoList}>
          {data.length === 0 ? (
            <Text>Žádný seznam</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(_, index) => index.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TodoList
                  list={item}
                  data={data}
                  deleteItem={() => deleteItem(index)}
                />
              )}
            />
          )}
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Image
              source={{ uri: "https://img.icons8.com/android/24/plus.png" }}
              height={35}
              width={35}
            />
          </TouchableOpacity>
          <Text style={{ marginTop: 10 }}>Přidat seznam</Text>
        </View>
        <Modal transparent={true} visible={addTodoVisible} animationType="fade">
          <NewList onOpen={closeModal} addItem={addItem} />
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  todoList: {
    width: "100%",
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    minHeight: "35%",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    width: "90%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "80%",
    alignItems: "center",
  },
  logoBorder: {
    width: "40%",
    borderWidth: 2,
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  button: {
    marginTop: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 40,
  },
});
