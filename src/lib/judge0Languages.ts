// Judge0 Language IDs Reference
// These IDs correspond to Judge0 CE (Community Edition) language codes
// https://ce.judge0.com/

export interface Judge0Language {
  id: number;
  name: string;
  extension: string;
  monacoLanguage: string; // For Monaco Editor integration
  defaultTemplate: string;
}

export const JUDGE0_LANGUAGES: Judge0Language[] = [
  {
    id: 71,
    name: "Python",
    extension: ".py",
    monacoLanguage: "python",
    defaultTemplate: `def solution(input_data):
    # Your code here
    pass

# Read input
if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read().strip()
    result = solution(input_data)
    print(result)`,
  },
  {
    id: 63,
    name: "JavaScript",
    extension: ".js",
    monacoLanguage: "javascript",
    defaultTemplate: `function solution(inputData) {
    // Your code here
}

// Read input
const readline = require('readline');
let input = '';
process.stdin.on('data', (chunk) => input += chunk);
process.stdin.on('end', () => {
    const result = solution(input.trim());
    console.log(result);
});`,
  },
  {
    id: 74,
    name: "TypeScript",
    extension: ".ts",
    monacoLanguage: "typescript",
    defaultTemplate: `function solution(inputData: string): string {
    // Your code here
    return "";
}

// Read input
const readline = require('readline');
let input = '';
process.stdin.on('data', (chunk: string) => input += chunk);
process.stdin.on('end', () => {
    const result = solution(input.trim());
    console.log(result);
});`,
  },
  {
    id: 62,
    name: "Java",
    extension: ".java",
    monacoLanguage: "java",
    defaultTemplate: `import java.util.Scanner;

public class Main {
    public static String solution(String inputData) {
        // Your code here
        return "";
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        StringBuilder input = new StringBuilder();
        while (scanner.hasNextLine()) {
            input.append(scanner.nextLine()).append("\\n");
        }
        String result = solution(input.toString().trim());
        System.out.println(result);
    }
}`,
  },
  {
    id: 54,
    name: "C++",
    extension: ".cpp",
    monacoLanguage: "cpp",
    defaultTemplate: `#include <iostream>
#include <string>
using namespace std;

string solution(string inputData) {
    // Your code here
    return "";
}

int main() {
    string input, line;
    while (getline(cin, line)) {
        input += line + "\\n";
    }
    cout << solution(input) << endl;
    return 0;
}`,
  },
  {
    id: 50,
    name: "C",
    extension: ".c",
    monacoLanguage: "c",
    defaultTemplate: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* solution(char* inputData) {
    // Your code here
    return "";
}

int main() {
    char input[10000];
    char line[1000];
    input[0] = '\\0';
    while (fgets(line, sizeof(line), stdin)) {
        strcat(input, line);
    }
    printf("%s\\n", solution(input));
    return 0;
}`,
  },
  {
    id: 60,
    name: "Go",
    extension: ".go",
    monacoLanguage: "go",
    defaultTemplate: `package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func solution(inputData string) string {
    // Your code here
    return ""
}

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    var lines []string
    for scanner.Scan() {
        lines = append(lines, scanner.Text())
    }
    input := strings.Join(lines, "\\n")
    fmt.Println(solution(input))
}`,
  },
  {
    id: 73,
    name: "Rust",
    extension: ".rs",
    monacoLanguage: "rust",
    defaultTemplate: `use std::io::{self, Read};

fn solution(input_data: &str) -> String {
    // Your code here
    String::new()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    println!("{}", solution(input.trim()));
}`,
  },
  {
    id: 72,
    name: "Ruby",
    extension: ".rb",
    monacoLanguage: "ruby",
    defaultTemplate: `def solution(input_data)
  # Your code here
end

input = STDIN.read.strip
puts solution(input)`,
  },
  {
    id: 68,
    name: "PHP",
    extension: ".php",
    monacoLanguage: "php",
    defaultTemplate: `<?php

function solution($inputData) {
    // Your code here
    return "";
}

$input = trim(file_get_contents("php://stdin"));
echo solution($input);`,
  },
  {
    id: 82,
    name: "SQL",
    extension: ".sql",
    monacoLanguage: "sql",
    defaultTemplate: `-- Write your SQL query here
SELECT * FROM table_name;`,
  },
  {
    id: 46,
    name: "Bash",
    extension: ".sh",
    monacoLanguage: "shell",
    defaultTemplate: `#!/bin/bash

# Your code here
read -r input
echo "$input"`,
  },
];

// Helper function to get language by name
export const getLanguageByName = (name: string): Judge0Language | undefined => {
  return JUDGE0_LANGUAGES.find(
    (lang) => lang.name.toLowerCase() === name.toLowerCase()
  );
};

// Helper function to get language by Judge0 ID
export const getLanguageById = (id: number): Judge0Language | undefined => {
  return JUDGE0_LANGUAGES.find((lang) => lang.id === id);
};

// Get all language names for dropdowns
export const getLanguageNames = (): string[] => {
  return JUDGE0_LANGUAGES.map((lang) => lang.name);
};

// Judge0 Submission Status Codes
export const JUDGE0_STATUS = {
  1: { id: 1, description: "In Queue" },
  2: { id: 2, description: "Processing" },
  3: { id: 3, description: "Accepted" },
  4: { id: 4, description: "Wrong Answer" },
  5: { id: 5, description: "Time Limit Exceeded" },
  6: { id: 6, description: "Compilation Error" },
  7: { id: 7, description: "Runtime Error (SIGSEGV)" },
  8: { id: 8, description: "Runtime Error (SIGXFSZ)" },
  9: { id: 9, description: "Runtime Error (SIGFPE)" },
  10: { id: 10, description: "Runtime Error (SIGABRT)" },
  11: { id: 11, description: "Runtime Error (NZEC)" },
  12: { id: 12, description: "Runtime Error (Other)" },
  13: { id: 13, description: "Internal Error" },
  14: { id: 14, description: "Exec Format Error" },
} as const;

export type Judge0StatusId = keyof typeof JUDGE0_STATUS;

// Interface for Judge0 submission
export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

// Interface for Judge0 submission result
export interface Judge0Result {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
}

// Interface for batch submission
export interface Judge0BatchSubmission {
  submissions: Judge0Submission[];
}
