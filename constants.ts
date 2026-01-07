import { FileNode, NodeType } from './types';

export const MOCK_FILE_SYSTEM: FileNode[] = [
  {
    name: "notes",
    path: "notes",
    type: NodeType.DIRECTORY,
    children: [
      {
        name: "tech",
        path: "notes/tech",
        type: NodeType.DIRECTORY,
        children: [
          {
            name: "frontend",
            path: "notes/tech/frontend",
            type: NodeType.DIRECTORY,
            children: [
              {
                name: "vue-basics.md",
                path: "notes/tech/frontend/vue-basics.md",
                type: NodeType.FILE,
                lastModified: "2023-11-01T10:00:00Z",
                content: "# Vue Basics 🌸\n\nVue is a progressive framework for building user interfaces.\n\n## Why Vue?\n\n1. approachable\n2. versatile\n3. performant\n\n## Component Structure\n\n```html\n<template>\n  <div>{{ msg }}</div>\n</template>\n```"
              },
              {
                name: "react-vs-vue.md",
                path: "notes/tech/frontend/react-vs-vue.md",
                type: NodeType.FILE,
                lastModified: "2023-10-20T14:30:00Z",
                content: "# React vs Vue\n\nComparison of the two giants.\n\n## Syntax\nVue uses templates, React uses JSX."
              }
            ]
          },
          {
            name: "backend",
            path: "notes/tech/backend",
            type: NodeType.DIRECTORY,
            children: [
              {
                name: "node-intro.md",
                path: "notes/tech/backend/node-intro.md",
                type: NodeType.FILE,
                lastModified: "2023-10-28T09:15:00Z",
                content: "# Node.js Intro\n\nJavaScript on the server."
              }
            ]
          }
        ]
      },
      {
        name: "diary",
        path: "notes/diary",
        type: NodeType.DIRECTORY,
        children: [
          {
            name: "2023-10-25.md",
            path: "notes/diary/2023-10-25.md",
            type: NodeType.FILE,
            lastModified: "2023-10-25T20:00:00Z",
            content: "# Sunny Day ☀️\n\nToday I learned how to deploy static sites."
          },
          {
            name: "sakura-trip.md",
            path: "notes/diary/sakura-trip.md",
            type: NodeType.FILE,
            lastModified: "2023-11-05T11:20:00Z",
            content: "# Trip to Kyoto\n\nThe cherry blossoms were beautiful!\n![Sakura](https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=600)\n\n## Itinerary\n- Kinkaku-ji\n- Fushimi Inari"
          }
        ]
      }
    ]
  }
];