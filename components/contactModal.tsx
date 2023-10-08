import { DataContext } from "@/app/layout";
import { Contact, Data } from "@/types/global";
import { useContext, useState } from "react";

type Props = {
  visible: boolean;
  closeModal: () => void;
};

const ContactModal = ({ visible, closeModal }: Props) => {
  const [dataForm, setDataForm] = useState<Contact>({
    first_name: "",
    last_name: "",
    id: Math.floor(1000000 + Math.random() * 9000000).toString(),
    phones: [],
  });

  const [dataPhone, setDataPhone] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setDataForm((prev) => {
      return {
        ...prev,
        [key]: e.target.value,
      };
    });
  };

  const handleChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataPhone(e.target.value);
  };

  const phoneInputChangedHandler = (dataPhone: string, index: number) => {
    const re = /^[0-9]*$/;
    if (re.test(dataPhone) == false || dataPhone == "") {
      alert("Phone Must Number!");
    } else {
      const newPhone = [...dataForm.phones];
      newPhone[index] = {
        number: dataPhone,
      };
      setDataForm((prev) => {
        return {
          ...prev,
          phones: newPhone,
        };
      });
      setDataPhone("");
    }
  };

  const ctx = useContext(DataContext);
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const re = /^[a-zA-Z0-9]*$/;
    if (re.test(dataForm.first_name) == false || dataForm.first_name == "") {
      alert("First Name Can't Empty & use Special Character");
    } else if (
      re.test(dataForm.last_name) == false ||
      dataForm.last_name == ""
    ) {
      alert("Last Name Can't Empty & use Special Character");
    } else if (dataForm.phones.length == 0) {
      alert("Must Add at Least 1 Phone Number");
    } else {
      const dataLocal: Data = ctx.dataLocal;
      dataLocal.contact.unshift(dataForm);
      localStorage.setItem("contacts", JSON.stringify(dataLocal));
      setDataForm({
        first_name: "",
        last_name: "",
        id: Math.floor(1000000 + Math.random() * 9000000).toString(),
        phones: [],
      });
      closeModal();
    }
  };

  return (
    <>
      {visible && (
        <div className="flex justify-center items-center bg-slate-700 fixed left-0 top-0 h-full w-full bg-opacity-50">
          <div className="bg-white py-8 px-14 flex flex-col rounded-xl z-20">
            <div className="my-4 flex flex-row">
              <div className="mx-2">First Name :</div>
              <div>
                <input
                  className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary text-center"
                  placeholder="Input First Name"
                  onChange={(e) => handleChange(e, "first_name")}
                ></input>
              </div>
            </div>
            <div className="my-4 flex flex-row">
              <div className="mx-2">Last Name :</div>
              <div>
                <input
                  className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary text-center"
                  placeholder="Input Last Name"
                  onChange={(e) => handleChange(e, "last_name")}
                ></input>
              </div>
            </div>
            <div className="my-4 flex flex-row">
              <div className="mx-2">
                <input
                  value={dataPhone}
                  className="relative m-0 block flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary text-center"
                  placeholder="Input Phone Number"
                  onChange={(e) => handleChangePhone(e)}
                ></input>
              </div>
              <div className="mx-2">
                <button
                  className="bg-black text-white px-2 py-1 rounded-md text-s"
                  onClick={() =>
                    phoneInputChangedHandler(dataPhone, dataForm.phones.length)
                  }
                >
                  Add
                </button>
              </div>
            </div>
            {dataForm.phones.map((phone, index) => {
              return (
                <div className="p-2">
                  Phone {index + 1} : {phone.number}
                </div>
              );
            })}
            <div>
              <button
                className="bg-red-500 text-white py-1 px-4 rounded-md text-s m-4"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-indigo-600 text-white py-1 px-4 rounded-md text-s m-4"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactModal;
