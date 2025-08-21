'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Hero from '@/components/Hero'
import RoleCards from '../components/RoleCards'
import RoleDescription from '../components/RoleDescription'
import Events from '../components/Events'
import Footer from '@/components/Footer'

export default function Home() {
  const [selectedRole, setSelectedRole] = useState('codes')

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <RoleCards onRoleSelect={handleRoleSelect} selectedRole={selectedRole} />
      <RoleDescription selectedRole={selectedRole} />
      <Events />
      <Footer />
    </main>
  )
}
