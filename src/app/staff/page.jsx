'use client';
import Descriptionbar from "../../(component)/Descriptionbar";
import React, { useState } from "react";

export default function Home() {
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div>

      <aside id="separator-sidebar" class="fixed top-0 left-0 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div class="h-full px-3 py-4 overflow-y-auto bg-gray-200 dark:bg-gray-800">

          <div class="bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900  dark:text-white">
            <h1 class="text-3xl font-bold text-white text-center py-4 rounded-md">
              Projects
            </h1>
          </div>

          {/* all projects */}
          <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">All Projects</span>
              </a>
            </li>
          </ul>

          {/* projects */}
          <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Project1</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Project2</span>

              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span class="flex-1 ms-3 whitespace-nowrap">Project3</span>
              </a>
            </li>
          </ul>

          {/* adding a new project */}
          <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li>
              <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">
                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                </svg>
                <span class="ms-3">Add a New Project</span>
              </a>
            </li>
          </ul>

        </div>
      </aside>

      <div class="p-3 sm:ml-64">

        <div class="p-1">

          <div class="relative bg-gray-300 dark:bg-gray-700 rounded-lg text-gray-900  dark:text-white">
            <h1 class="text-3xl font-bold text-white py-4 rounded-md text-center">
              Project Name
            </h1>
          </div>

          <div class=" mb-4 rounded-lg bg-gray-200 dark:bg-gray-800 p-5">
            <div class="bg-gray-300 dark:bg-gray-700 rounded-full w-40">
              <h1 class="text-2xl mb-3 ml-4 px-1 py-1">Open</h1>
            </div>

            <div class="relative overflow-x-auto">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Task
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Assigns
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Due date
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Priority
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Time Estimation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr onClick={() => setShowDescription(!showDescription)} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Laptop
                    </td>
                    <td class="px-6 py-4">
                      $2999
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                  </tr>
                  <tr onClick="" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Laptop
                    </td>
                    <td class="px-6 py-4">
                      $2999
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                  </tr>
                  <tr onClick="" class=" cursor-pointer hover:bg-gray-300">
                    <th scope="row" class="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                      </svg>
                      <span class="ms-3">Add a New Task</span>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <div class=" mb-4 rounded-lg bg-gray-200 dark:bg-gray-800 p-5">
            <div class="bg-gray-300 dark:bg-gray-700 rounded-full w-40">
              <h1 class="text-2xl mb-3 ml-4 px-1 py-1">Open</h1>
            </div>

            <div class="relative overflow-x-auto">
              <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">
                      Task
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Assigns
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Due date
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Priority
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Time Estimation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr onClick="" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Laptop
                    </td>
                    <td class="px-6 py-4">
                      $2999
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                  </tr>
                  <tr onClick="" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Laptop
                    </td>
                    <td class="px-6 py-4">
                      $2999
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                  </tr>
                  <tr onClick="" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 cursor-pointer hover:bg-gray-300">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      Apple MacBook Pro 17"
                    </th>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Laptop
                    </td>
                    <td class="px-6 py-4">
                      $2999
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                    <td class="px-6 py-4">
                      Silver
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

        </div>

        <div class="bottom-0 right-0 w-full bg-gray-200 dark:bg-gray-800 p-4 border-l border-gray-300 dark:border-gray-700">
          {showDescription && <Descriptionbar />}
        </div>
      </div>
    </div>
  );
}
