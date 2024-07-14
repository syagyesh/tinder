"use server";

import driver from "@/db";
import { Neo4jUser } from "../../types";

export const getUserbyID = async (id: string) => {
  const result = await driver.executeQuery(
    `MATCH (u: User {applicationId: $id}) RETURN u`,
    { id }
  );
  const user = result.records.map((record) => record.get(`u`).properties);
  if (user.length === 0) {
    return null;
  }
  return user[0] as Neo4jUser;
}

export const createUser = async (user: Neo4jUser) => {
  const { id, firstName, lastName, email } = user;
  await driver.executeQuery(
    `CREATE (u: User {applicationId: $id, firstName: $firstName, lastName: $lastName, email: $email})`,
    { id, firstName, lastName, email }
  )
}

export const getUserWithNoConnections = async (id: string) => {
  const result = await driver.executeQuery(
    `MATCH (cu: User {applicationId: $id}) MATCH (ou: User) WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou RETURN ou`,
    { id }
  )
  const users = result.records.map((record) => record.get(`ou`).properties);
  return users as Neo4jUser[];
}

export const neo4jSwipe = async (
  id: string,
  otherId: string,
  direction: string
) => {
  const type = direction === "right" ? "LIKE" : "DISLIKE";
  await driver.executeQuery(
    `MATCH (cu: User {applicationId: $id}), (ou: User {applicationId: $otherId}) CREATE (cu)-[:${type}]->(ou)`,
    { id, otherId }
  );
  if (type === "LIKE") {
    const result = await driver.executeQuery(
      `MATCH (cu: User {applicationId: $id}), (ou: User {applicationId: $otherId}) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`,
      { id, otherId }
    );
    const matches = result.records.map((record) => record.get(`match`).properties);
    return Boolean(matches.length > 0);
  }
}

export const getMatches = async (id: string) => {
  const result = await driver.executeQuery(
    `MATCH (cu: User {applicationId: $id})-[:LIKE]->(ou: User)-[:LIKE]->(cu) RETURN ou as match`,
    { id }
  );
  const matches = result.records.map((record) => record.get(`match`).properties);
  return matches as Neo4jUser[];
}

