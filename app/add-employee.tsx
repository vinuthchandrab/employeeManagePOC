import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEmployees } from "../contexts/EmployeeContext";

export default function AddEmployeeScreen() {
  const router = useRouter();
  const { addEmployee } = useEmployees();

  const [name, setName] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [joiningDate, setJoiningDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});

  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: async () => {
            const permission =
              await ImagePicker.requestCameraPermissionsAsync();
            if (permission.granted) {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
              });
              if (!result.canceled && result.assets[0].base64) {
                setImageUri(
                  `data:image/jpeg;base64,${result.assets[0].base64}`,
                );
              }
            }
          },
        },
        {
          text: "Gallery",
          onPress: async () => {
            const permission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.granted) {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
              });
              if (!result.canceled && result.assets[0].base64) {
                setImageUri(
                  `data:image/jpeg;base64,${result.assets[0].base64}`,
                );
              }
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!yearsOfExperience || isNaN(Number(yearsOfExperience))) {
      newErrors.yearsOfExperience = "Valid years of experience is required";
    }
    if (!imageUri) {
      //   newErrors.imageUri = "Employee image is required";
      setImageUri("https://via.placeholder.com/150/4ECDC4/FFFFFF");
    }
    if (skills.length === 0) {
      newErrors.skills = "At least one skill is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      addEmployee({
        name: name.trim(),
        yearsOfExperience: Number(yearsOfExperience),
        joiningDate: joiningDate.toISOString().split("T")[0],
        imageUri,
        skills,
      });
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.navigate("/dashboard");
            }}
          >
            <Ionicons name="close" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Employee</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.imageSection} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={40} color="#999" />
                <Text style={styles.avatarPlaceholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.imageUri && (
            <Text style={styles.errorText}>{errors.imageUri}</Text>
          )}

          <View style={styles.formSection}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter employee name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Years of Experience *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter years"
              value={yearsOfExperience}
              onChangeText={setYearsOfExperience}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
            {errors.yearsOfExperience && (
              <Text style={styles.errorText}>{errors.yearsOfExperience}</Text>
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Joining Date *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateButtonText}>
                {joiningDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={joiningDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setJoiningDate(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Skills *</Text>
            <View style={styles.skillInputContainer}>
              <TextInput
                style={styles.skillInput}
                placeholder="Add a skill"
                value={skillInput}
                onChangeText={setSkillInput}
                placeholderTextColor="#999"
                onSubmitEditing={addSkill}
              />
              <TouchableOpacity
                style={styles.addSkillButton}
                onPress={addSkill}
              >
                <Ionicons name="add" size={24} color="#4A90E2" />
              </TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(index)}>
                    <Ionicons name="close-circle" size={18} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {errors.skills && (
              <Text style={styles.errorText}>{errors.skills}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 16,
    fontSize: 16,
    color: "#1A1A1A",
  },
  dateButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#1A1A1A",
  },
  skillInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  skillInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 16,
    fontSize: 16,
    color: "#1A1A1A",
  },
  addSkillButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  skillChipText: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "600",
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 13,
    marginTop: 4,
  },
});
