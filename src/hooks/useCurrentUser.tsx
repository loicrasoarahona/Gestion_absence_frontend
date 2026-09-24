import { useEffect, useState } from "react";
import type { UserAttributes } from "../models/interfaces";
import ServiceSelector from "../core/ServiceSelector";

export function useCurrentUser() {
  const [user, setUser] = useState<UserAttributes | null>(null);

  useEffect(() => {
    ServiceSelector.authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => {
        /*aucune logique*/
      });
  }, []);

  return { user };
}
