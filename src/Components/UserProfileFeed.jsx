import { Box, Skeleton, Stack } from "@mui/material";
import React, { useContext, useEffect } from "react";
import Post from "./Post";
import axios from "axios";
import { useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getMongoIdFromCognitoId } from "../apiCalls";

const url = "https://0tcdj2tfi8.execute-api.eu-central-1.amazonaws.com";

function Feed({ cognitoId, seteffectRun, effectRun, tabValue }) {
  const userContext = useContext(UserContext);
  const { posts } = userContext.user;
  const [userProfileFeedEffect, setuserProfileFeedEffect] = useState(false);
  const [loading, setloading] = useState(true);

  const [userPosts, setUserPosts] = useState([]);
  const getUserPosts = async (mongoId) => {
    setloading(true);
    const endpoint =
      tabValue === "MyPosts"
        ? `${url}/dev/posts/user/${mongoId}`
        : `${url}/dev/postsJoined/${mongoId}`;
    try {
      const res = await axios.get(endpoint);
      const data = res.data;
      console.log(data, "user post data from mongo id");
      setUserPosts(data);
      setloading(false);
    } catch (error) {}
  };
  const renderPosts = userPosts.map((el) => {
    return (
      <Post
        userProfileFeedEffect={userProfileFeedEffect}
        setuserProfileFeedEffect={setuserProfileFeedEffect}
        seteffectRun={seteffectRun}
        effectRun={effectRun}
        called="userProfile"
        post={el}
      />
    );
  });
  useEffect(() => {
    getMongoIdFromCognitoId(cognitoId).then((id) => getUserPosts(id));
  }, [effectRun, userProfileFeedEffect, tabValue]);

  return (
    <Stack flex={8}>
      {loading ? (
        <Stack
          sx={{ height: "100vh" }}
          my={1}
          marginX={1}
          padding={1}
          spacing={1}
        >
          <Skeleton variant="rectangular" height={300} />
          <Skeleton variant="rectangular" height={300} />
        </Stack>
      ) : (
        renderPosts
      )}
    </Stack>
  );
}

export default Feed;
