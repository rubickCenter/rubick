import { reactive, toRefs } from "vue";
import {ipcRenderer} from "electron";

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

  return {
    ...toRefs(state),
    onSearch,
    setSearchValue,
  };
};

export default searchManager;
