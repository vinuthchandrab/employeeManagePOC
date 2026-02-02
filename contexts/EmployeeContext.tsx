import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Employee {
  id: string;
  name: string;
  yearsOfExperience: number;
  joiningDate: string;
  imageUri: string;
  skills: string[];
}

interface EmployeeContextType {
  employees: Employee[];
  emps: Employee[];
  addEmployee: (employee: Omit<Employee, "id">) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeesByName: (name: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined,
);

// Sample employees data
const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    yearsOfExperience: 5,
    joiningDate: "2019-03-15",
    imageUri: "https://via.placeholder.com/150/4A90E2/FFFFFF?text=SJ",
    skills: ["React Native", "JavaScript", "TypeScript", "Node.js"],
  },
  {
    id: "2",
    name: "Michael Chen",
    yearsOfExperience: 8,
    joiningDate: "2016-07-22",
    imageUri: "https://via.placeholder.com/150/7B68EE/FFFFFF?text=MC",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    yearsOfExperience: 3,
    joiningDate: "2021-01-10",
    imageUri: "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=ER",
    skills: ["UI/UX", "Figma", "React", "CSS"],
  },
  {
    id: "4",
    name: "David Kim",
    yearsOfExperience: 6,
    joiningDate: "2018-09-05",
    imageUri: "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=DK",
    skills: ["Java", "Spring Boot", "Microservices", "Docker"],
  },
];

export const EmployeeProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [emps, setEmps] = useState<Employee[]>(employees);

  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const getEmployeeById = (id: string) => {
    return employees.find((emp) => emp.id === id);
  };

  const getEmployeesByName = (name: string) => {
    const empz: Employee[] = [];
    employees.forEach((emp) => {
      if (emp.name.toUpperCase().includes(name.toUpperCase())) {
        empz.push(emp);
      }
    });
    setEmps(empz);
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        emps,
        addEmployee,
        deleteEmployee,
        getEmployeeById,
        getEmployeesByName,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within EmployeeProvider");
  }
  return context;
};
