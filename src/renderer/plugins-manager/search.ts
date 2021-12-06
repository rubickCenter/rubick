import { reactive, toRefs } from "vue";

const searchManager = () => {
  const state = reactive({
    searchValue: "",
  });

  // search Input operation
  const onSearch = (e) => {
    const value = e.target.value;
    state.searchValue = value;
  };

  return {
    ...toRefs(state),
    onSearch,
  };
};

export default searchManager;
