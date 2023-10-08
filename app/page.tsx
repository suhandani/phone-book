"use client";

import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { gql } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import ContactModal from "@/components/contactModal";
import { DataContext } from "./layout";
import { Data } from "@/types/global";
import { paginate } from "@/helpers/paginate";
import Pagination from "@/components/pagination";

const queryGetContacts = gql`
  query GetContacts {
    contact {
      id
      first_name
      last_name
      phones {
        number
      }
    }
  }
`;

export default function Home() {
  const { data }: { data: Data } = useSuspenseQuery(queryGetContacts);
  const ctx = useContext(DataContext);
  const dataLocal = ctx.dataLocal;
  const [visible, setVisible] = useState(false);
  const [favorite, setFavorite] = useState<string[]>([]);
  const [dataSearch, setDataSearch] = useState(dataLocal);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if ("contacts" in localStorage && "favorite" in localStorage) {
      setFavorite(JSON.parse(localStorage.getItem("favorite") || "[]"));
    } else {
      localStorage.setItem("contacts", JSON.stringify(data));
      localStorage.setItem("favorite", "");
    }
    ctx.getDataLocal();
  }, []);

  useEffect(() => {
    searchHandler();
  }, [dataLocal, search]);

  const searchHandler = () => {
    if (search == "") {
      return setDataSearch(dataLocal);
    }
    const newData = {
      contact: dataLocal.contact.filter((contact) =>
        contact.first_name.includes(search)
      ),
    };
    setCurrentPage(1);
    setDataSearch(newData);
  };

  const closeModal = () => {
    setVisible(false);
  };
  const openModal = () => {
    setVisible(true);
  };

  const deleteContact = (id: string) => {
    const newData = {
      contact: dataLocal.contact.filter((obj) => obj.id != id),
    };
    localStorage.setItem("contacts", JSON.stringify(newData));
    ctx.getDataLocal();
    if (paginatedPosts.length == 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFavorite = (id: string) => {
    setFavorite((prev) => {
      const newFavorite = favorite.length == 0 ? [id] : [...prev, id];
      localStorage.setItem("favorite", JSON.stringify(newFavorite));
      return newFavorite;
    });
    if (paginatedPosts.length == 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRemoveFavorite = (index: number) => {
    setFavorite((prev) => {
      const newFavorite = [...prev];
      newFavorite.splice(index, 1);
      localStorage.setItem("favorite", JSON.stringify(newFavorite));
      return favorite.length == 1 ? [] : newFavorite;
    });
    if (paginatedPosts.length == 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const paginatedPosts = paginate(
    dataSearch.contact,
    currentPage,
    pageSize,
    favorite
  );

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="flex flex-row mb-4">
          <div className="text-3xl font-medium text-left px-16">Contact</div>
          <div className="px-14">
            <button
              className="bg-indigo-600 text-white py-1 px-4 rounded-md text-s"
              onClick={openModal}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex py-4">
          <input
            className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
            placeholder="Search"
            onChange={handleSearch}
          ></input>
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="text-sm text-left text-gray-500 dark:text-gray-400 table-fixed w-96">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {favorite.length > 0 &&
                dataLocal?.contact
                  .filter((filter) => favorite.includes(filter.id))
                  .map((contact, index: number) => {
                    return (
                      <tr
                        key={index}
                        className="bg-blue-200 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate"
                        >
                          {contact.first_name} {contact.last_name}
                        </th>
                        <td className="px-6 py-4">
                          <select className="truncate w-[100px]">
                            {contact.phones.map((phone, index: number) => {
                              return (
                                <option key={index}>{phone.number}</option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleRemoveFavorite(index)}>
                            <svg
                              className="w-5 h-5 text-yellow-300"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              {paginatedPosts.map((contact, index: number) => {
                return (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate"
                    >
                      {contact.first_name} {contact.last_name}
                    </th>
                    <td className="px-6 py-4">
                      <select className="truncate w-[100px]">
                        {contact.phones.map((phone, index: number) => {
                          return <option key={index}>{phone.number}</option>;
                        })}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleFavorite(contact.id)}>
                        <svg
                          className="w-5 h-5 text-gray-300 dark:text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteContact(contact.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="red"
                          className="w-5 h-5 ml-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          items={dataSearch.contact.length - favorite.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </main>
      <ContactModal visible={visible} closeModal={closeModal} />
    </>
  );
}
