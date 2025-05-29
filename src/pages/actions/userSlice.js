import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const getUser = createAsyncThunk("userSlice/getUser", async () => {
  const response = await api.get("/users/get_user");
  return response.data;
});
export const getHomeGallery = createAsyncThunk(
  "userSlice/getHomeGallery",
  async (data) => {
    const response = await api.post("/photos/home-gallery", data);
    return response.data;
  }
);
export const getSinglePhoto = createAsyncThunk(
  "userSlice/getSinglePhoto",
  async (data) => {
    const response = await api.post("/photos/fetch-gallery", data);
    return response.data;
  }
);

export const getFavourateList = createAsyncThunk(
  "userSlice/getFavourateList",
  async (data) => {
    const response = await api.post("/photos/my-favorites-list", data);
    return response.data;
  }
);

const initialState = { gallery: [], hasMore: true, myfavorates: [] };

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUsers: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
    resetGallery: (state) => {
      state.gallery = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.user = {};
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.user = payload?.data;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = {};
      })
      .addCase(getHomeGallery.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHomeGallery.fulfilled, (state, { payload }) => {
        if (payload.pagination.currentPage === 1) {
          state.gallery = payload?.data || [];
        } else {
          state.gallery = [...state.gallery, ...(payload?.data || [])];
        }
        state.hasMore =
          payload?.pagination?.currentPage * payload?.pagination?.itemsPerPage <
          payload?.totalPhotos;
        state.isLoading = false;
      })
      .addCase(getHomeGallery.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSinglePhoto.pending, () => {})
      .addCase(getSinglePhoto.fulfilled, (state, { payload }) => {
        state.singlephoto = payload?.data;
      })
      .addCase(getSinglePhoto.rejected, () => {})

      .addCase(getFavourateList.pending, () => {})
      .addCase(getFavourateList.fulfilled, (state, { payload }) => {
        state.myfavorates = payload?.content;
      })
      .addCase(getFavourateList.rejected, () => {});
  },
});

export const { setUsers, resetGallery } = userSlice.actions;
export default userSlice.reducer;
