"use client";

<<<<<<< HEAD
import "swagger-ui-react/swagger-ui.css";
=======
>>>>>>> 956a6d9 (feat: finalize first version - clean codebase and fix build issues)

import SwaggerUI from "swagger-ui-react";

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2"><strong>Base URL:</strong> <code>/api/auth</code></p>
            <p>All API endpoints require authentication via Better Auth.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Programs</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">GET /api/programs</h3>
              <p className="text-gray-600">Get all programs for the authenticated coach</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">POST /api/programs</h3>
              <p className="text-gray-600">Create a new program</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">PUT /api/programs/[id]</h3>
              <p className="text-gray-600">Update a program</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Sessions</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">GET /api/programs/[id]/sessions</h3>
              <p className="text-gray-600">Get all sessions for a program</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">POST /api/programs/[id]/sessions</h3>
              <p className="text-gray-600">Create a new session</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Exercises</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">GET /api/exercises/library</h3>
              <p className="text-gray-600">Get exercise library</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">POST /api/trainings/[sessionId]/exercises</h3>
              <p className="text-gray-600">Add exercise to session</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Coach Dashboard</h2>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">GET /api/coach/stats</h3>
              <p className="text-gray-600">Get coach statistics</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">GET /api/coach/clients</h3>
              <p className="text-gray-600">Get coach clients</p>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold">GET /api/coach/today-sessions</h3>
              <p className="text-gray-600">Get today's sessions</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 