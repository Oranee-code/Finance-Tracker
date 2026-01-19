import connection from './connection.ts'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  email: string
  name: string
  created_at: Date
  updated_at: Date
}

export interface NewUser {
  email: string
  password: string
  name: string
}

export async function createUser(user: NewUser): Promise<User> {
  const passwordHash = await bcrypt.hash(user.password, 10)
  
  // SQLite returns the last inserted row ID as an array
  const result = await connection('users')
    .insert({
      email: user.email.toLowerCase().trim(),
      password_hash: passwordHash,
      name: user.name.trim(),
    })
  
  // Get the inserted ID (SQLite returns it as an array)
  const id = Array.isArray(result) ? result[0] : result
  
  // Fetch the created user
  const createdUser = await connection('users')
    .where('id', id)
    .select('id', 'email', 'name', 'created_at', 'updated_at')
    .first()
  
  if (!createdUser) {
    throw new Error('Failed to create user')
  }
  
  return createdUser
}

export async function getUserByEmail(email: string): Promise<User & { password_hash: string } | undefined> {
  const user = await connection('users')
    .where('email', email.toLowerCase().trim())
    .first()
  
  return user
}

export async function getUserById(id: number): Promise<User | undefined> {
  const user = await connection('users')
    .where('id', id)
    .select('id', 'email', 'name', 'created_at', 'updated_at')
    .first()
  
  return user
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

