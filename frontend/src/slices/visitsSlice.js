import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  visits: [
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -102.304789,
                21.850483
            ]
        },
        "properties": {
            "location": "3000158291",
            "rep": "Alexis Matus",
            "city": "Aguascalientes",
            "state": "Aguascalientes",
            "latitude": 21.850483,
            "longitude": -102.304789,
            "cluster": 2,
            "cluster_city": 2,
            "cluster_day": 2,
            "company_code": "MX10",
            "business_type": "RS"
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -102.270004,
                21.85216
            ]
        },
        "properties": {
            "location": "4000062845",
            "rep": "Alexis Matus",
            "city": "Aguascalientes",
            "state": "Aguascalientes",
            "latitude": 21.85216,
            "longitude": -102.270004,
            "cluster": 2,
            "cluster_city": 2,
            "cluster_day": 2,
            "company_code": "MX10",
            "business_type": "RS"
        }
    },
    {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -102.270004,
                21.85216
            ]
        },
        "properties": {
            "location": "4000115200",
            "rep": "Alexis Matus",
            "city": "Aguascalientes",
            "state": "Aguascalientes",
            "latitude": 21.85216,
            "longitude": -102.270004,
            "cluster": 2,
            "cluster_city": 2,
            "cluster_day": 2,
            "company_code": "MX10",
            "business_type": "RS"
        }
    }
  ],
  routes: [],
  reps: [],
  glids: [],
};

function convertToGeoJSON(dataJson) {
  const visits = dataJson.map(visit => {
    const visitDict = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(visit.longitude), parseFloat(visit.latitude)],
      },
      properties: {...visit}
    };
    return visitDict;
  });
  return visits;
};

export const VisitsSlice = createSlice({
  name: "visits",
  initialState,
  reducers: {
    setVisits: (state, action) => {
      const data = action.payload;
      const visits = convertToGeoJSON(data);
      const reps = Array.from(new Set(data.map(item => item.rep)));
      const glids = Array.from(new Set(data.map(item => item.location)));
      state.data = data;
      state.visits = visits;
      state.reps = reps;
      state.glids = glids;
    },
    filterVisitsByRep: (state, action) => {
      const repName = action.payload;
      const filteredData = state.data.filter(visit => visit.rep === repName);
      state.visits = convertToGeoJSON(filteredData);
    },
    filterVisitLocation: (state, action) => {
      const location = action.payload;
      const filteredData = state.data.filter(visit => visit.location === location);
      state.visits = convertToGeoJSON(filteredData);
    },
    setRoutes: (state, action) => {
      state.routes = action.payload;
    },
  }
});


export const { setVisits, setRoutes, filterVisitsByRep, filterVisitLocation } = VisitsSlice.actions;
export const selectVisits = (state) => state.visits;
export default VisitsSlice.reducer;