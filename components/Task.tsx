import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { TaskProps } from "../.expo/types/index";

export default function Task({
  title,
  check,
  toggleTaskCompleted,
  deleteTask,
  editTask,
  onEditStart,
  onEditEnd,
}: TaskProps): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    setIsClicked(check);
  }, [check]);

  const handleDone = (): void => {
    toggleTaskCompleted(title);
    setIsClicked(!isClicked);
  };

  const handleEdit = (): void => {
    setEditedTitle(title);
    setIsEditing(true);
    onEditStart();
  };

  const handleSave = (): void => {
    if (editedTitle.trim() === "") {
      return;
    }
    editTask(title, editedTitle);
    setIsEditing(false);
    onEditEnd();
  };

  return (
    <View style={{ marginTop: 15 }}>
      <View style={styles.container}>
        <View style={styles.containerContent}>
          <TouchableOpacity style={{ width: "10%" }} onPress={handleDone}>
            {isClicked ? (
              <Feather name="check-circle" size={24} color="black" />
            ) : (
              <Feather name="circle" size={24} color="black" />
            )}
          </TouchableOpacity>
          {isEditing ? (
            <TextInput
              value={editedTitle}
              onChangeText={setEditedTitle}
              onSubmitEditing={handleSave}
              scrollEnabled={true}
              style={{
                width: "70%",
                textDecorationLine: isClicked ? "line-through" : "none",
                color: isClicked ? "gray" : "black",
              }}
            />
          ) : (
            <Text
              numberOfLines={1}
              style={{
                width: "70%",
                textDecorationLine: isClicked ? "line-through" : "none",
                color: isClicked ? "gray" : "black",
              }}
            >
              {title}
            </Text>
          )}
          <TouchableOpacity
            style={styles.editIcon}
            onPress={isEditing ? handleSave : handleEdit}
          >
            <Feather
              name={isEditing ? "save" : "edit-2"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={() => deleteTask(title)}
          >
            <Feather name="trash-2" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  containerContent: {
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
    height: 40,
  },
  editIcon: {
    width: "10%",
    alignItems: "center",
  },
  deleteIcon: {
    width: "10%",
    alignItems: "center",
  },
});
