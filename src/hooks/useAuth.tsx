/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import type { UserAttributes } from "../models/interfaces";
import ServiceSelector from "../core/ServiceSelector";
import { useNavigate } from "react-router";

export function useAuth() {
  const [user, setUser] = useState<UserAttributes>();
  const navigate = useNavigate();

  const loadUser = async () => {
    try {
      setUser(await ServiceSelector.authService.getCurrentUser());
    } catch (error) {
      console.error("user info unchecked", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { user };
}
