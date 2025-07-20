#!/usr/bin/env tsx

import { authClient } from "@/lib";
import "dotenv/config";

const allUsers = [
  { email: "marie.martin@example.com", name: "Marie Martin", isCoach: true, firstName: "Marie", lastName: "Martin", phone: "0601020304" },
  { email: "thomas.dubois@example.com", name: "Thomas Dubois", isCoach: true, firstName: "Thomas", lastName: "Dubois", phone: "0605060708" },
  { email: "sophie.laurent@example.com", name: "Sophie Laurent", isCoach: true, firstName: "Sophie", lastName: "Laurent", phone: "0609101112" },
  { email: "alexandre.dupont@example.com", name: "Alexandre Dupont", isCoach: false, firstName: "Alexandre", lastName: "Dupont", phone: "0613141516" },
  { email: "emma.rousseau@example.com", name: "Emma Rousseau", isCoach: false, firstName: "Emma", lastName: "Rousseau", phone: "0617181920" },
  { email: "lucas.moreau@example.com", name: "Lucas Moreau", isCoach: false, firstName: "Lucas", lastName: "Moreau", phone: "0621222324" },
  { email: "julie.bernard@example.com", name: "Julie Bernard", isCoach: false, firstName: "Julie", lastName: "Bernard", phone: "0625262728" },
  { email: "pierre.leroy@example.com", name: "Pierre Leroy", isCoach: false, firstName: "Pierre", lastName: "Leroy", phone: "0629303132" },
];

async function main() {
  for (const u of allUsers) {
    await authClient.signUp.email({
      email: u.email,
      password: "azerty123",
      name: u.name,
    }, {
      onSuccess: () => {
        console.log(`✅ Compte créé pour ${u.email}`);
      },
      onError: (err) => {
        console.error(`❌ Erreur pour ${u.email}:`, err);
      }
    });
  }
  console.log("🎉 Création des comptes terminée !");
}

main(); 