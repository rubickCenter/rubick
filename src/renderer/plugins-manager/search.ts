import { reactive, toRefs } from "vue";
import { ipcRenderer, remote } from "electron";

const searchManager = () => {
  const state = reactive({
    searchValue: "",
    placeholder: "",
  });

  // search Input operation
  const onSearch = (e) => {
    const value = e.target.value;
    state.searchValue = value;
    ipcRenderer.sendSync("msg-trigger", {
      type: "sendSubInputChangeEvent",
      data: value,
    });
  };

  const setSearchValue = (value: string) => {
    state.searchValue = value;
  };

  window.setSubInput = ({ placeholder }: { placeholder: string }) => {
    state.placeholder = placeholder;
  };
  window.removeSubInput = () => {
    state.placeholder = "";
  };
  window.setSubInputValue = ({ value }: { value: string }) => {
    state.searchValue = value;
  };

  return {
    ...toRefs(state),
    onSearch,
    setSearchValue,
  };
};

export default searchManager;
