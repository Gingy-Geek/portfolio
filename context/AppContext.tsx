"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, exampleUser, Section } from "@/models/user";

interface AppContextType {
  user: User;
  setUser: (user: User) => void;
  setTempUser: (user: User) => void;
  tempUser: User;
  setTempUserWithFlag: (user: User) => void;
  saveTempUser: () => void;
  getSection: (section: string) => Section<any> | undefined;
  editMode: boolean;
  setEditMode: (isEdit: boolean) => void;
  hasChanges: boolean;
  setHasChanges: (bool: boolean) => void;
}

const UserContext = createContext<AppContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(exampleUser);
  const [tempUser, setTempUser] = useState<User>({ ...exampleUser });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const setTempUserWithFlag = (newTempUser: User) => {
    setTempUser(newTempUser);
    setHasChanges(JSON.stringify(newTempUser) !== JSON.stringify(user));
  };

  const saveTempUser = () => {
    setUser({ ...tempUser });
    setHasChanges(false);
  };

  const getSection = (section: string) => {
    return user.sections.find((sec) => sec.id === section);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getSection,
        tempUser,
        setTempUser,
        setTempUserWithFlag,
        saveTempUser,
        editMode,
        setEditMode,
        setHasChanges,
        hasChanges,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
