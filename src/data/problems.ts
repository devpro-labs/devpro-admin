import { Problem } from "@/lib/types";


export const mockProblems: Problem[] = [
  {
    id: "1",
    title: "Two Sum",
    statement:
      "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    description:
      "You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    framework: "express",
    testCases: [
      {
        id: "tc1",
        input: "[2,7,11,15], target = 9",
        expectedOutput: "[0,1]",
        type: "sample",
      },
      {
        id: "tc2",
        input: "[3,2,4], target = 6",
        expectedOutput: "[1,2]",
        type: "hidden",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Reverse String",
    statement: "Write a function that reverses a string.",
    description:
      "The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.",
    framework: "fastapi",
    testCases: [
      {
        id: "tc3",
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        type: "sample",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
