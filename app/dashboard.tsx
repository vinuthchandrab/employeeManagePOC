import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Employee, useEmployees } from "../contexts/EmployeeContext";

export default function DashboardScreen() {
  const { employees, emps, deleteEmployee, getEmployeesByName } =
    useEmployees();
  const [employeez, setEmployeez] = useState<Employee[]>(employees);
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );
  const [name, setName] = useState("");

  const handleLongPress = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setDeleteModalVisible(true);
  };

  const handlePress = (employeeId: string) => {
    router.push(`/employee-details?id=${employeeId}`);
  };

  const handleDelete = () => {
    if (selectedEmployeeId) {
      deleteEmployee(selectedEmployeeId);
      setDeleteModalVisible(false);
      setSelectedEmployeeId(null);
    }
  };

  const handleSearch = () => {
    setEmployeez([]);
    if (name) {
      console.log(name);
      getEmployeesByName(name);
      setEmployeez(emps);
      console.log(emps);
    } else {
      setEmployeez(employees);
    }
  };

  const handleCancel = () => {
    setDeleteModalVisible(false);
    setSelectedEmployeeId(null);
  };

  const renderEmployee = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.id)}
      onLongPress={() => handleLongPress(item.id)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUri }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
            {item.yearsOfExperience} years experience
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>
            Joined: {new Date(item.joiningDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.skillsContainer}>
          {item.skills.slice(0, 2).map((skill: string, index: number) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {item.skills.length > 2 && (
            <View style={styles.skillBadge}>
              <Text style={styles.skillText}>+{item.skills.length - 2}</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Employees</Text>
            <Text style={styles.headerSubtitle}>
              {employeez.length} team members
            </Text>
          </View>
          <View style={{ flex: 0.3, position: "relative" }}>
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons
                name="search"
                size={14}
                color="#666"
                style={{
                  position: "absolute",
                  right: 12, // Position inside right padding
                  top: "80%",
                  marginTop: 17, // Center vertically (half icon size)
                }}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Employee Details"
              placeholderTextColor="#615d5d"
              value={name}
              onChangeText={setName}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/add-employee")}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {employeez.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No employees yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add one</Text>
          </View>
        ) : (
          <FlatList
            data={employeez}
            renderItem={renderEmployee}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancel}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIconContainer}>
                  <Ionicons name="trash-outline" size={32} color="#E74C3C" />
                </View>
                <Text style={styles.modalTitle}>Delete Employee</Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete this employee? This action
                  cannot be undone.
                </Text>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
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
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },
  skillBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 11,
    color: "#4A90E2",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#BBB",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0c0101",
    padding: 16,
    fontSize: 16,
    color: "#1A1A1A",
  },
});
