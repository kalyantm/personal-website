// import { getTime } from "date-fns";
const GOOGLE_FIT_ENDPOINT =
  "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate";
const access_token =
  "ya29.A0ARrdaM9piLQPS_00FBQPEfxt7J5TGVuee3K4FxgCYUDCAMGRVwC0HlN4rK8xrgD6qonUVpBY7pfUQiVMgYZag0tHr9JcnXhhz-LdZiyC-xx2PlGXt7_hvy0PPthqINEPPkCaNf6ztKiau1ldu0HzNnkc3fZo";

const fitnessOptions = {
  aggregateBy: [
    {
      dataTypeName: "com.google.calories.expended",
    },
    {
      dataTypeName: "com.google.active_minutes",
    },
    {
      dataTypeName: "com.google.heart_minutes",
    },
    {
      dataTypeName: "com.google.step_count.delta",
    },
  ],
  bucketByTime: { durationMillis: 86400000 },
  startTimeMillis: 1652486400000,
  endTimeMillis: 1652572799000,
};

export async function getCurrentFitness() {
  // console.log('TIME', getMilliSeconds())
  const fitnessResponse = await fetch(GOOGLE_FIT_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(fitnessOptions),
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (fitnessResponse.status === 204 || fitnessResponse.status > 400) {
    return {
      fitnessData: undefined,
    };
  }

  const fitnessStats = await fitnessResponse.json();
  console.log("fit ness dats", fitnessStats);
  //   const fitnessBucket = fitnessStats.bucket;
  return fitnessStats.bucket[0].dataset.reduce(
    (acc, item) => {
      if (item.dataSourceId.includes("calories.expended")) {
        return { ...acc, move: item.point[0].value[0].fpVal };
      }
      if (item.dataSourceId.includes("active_minutes")) {
        return { ...acc, exercise: item.point[0].value[0].intVal };
      }

      if (item.dataSourceId.includes("heart_minutes")) {
        return { ...acc, heart: item.point[0].value[0].fpVal };
      }

      if (item.dataSourceId.includes("step_count")) {
        return { ...acc, step: item.point[0].value[0].intVal };
      }
    },
    {
      exercise: 0,
      move: 0,
      heart: 0,
      step: 0,
    }
  );
  //   return fitnessResponse;
}
