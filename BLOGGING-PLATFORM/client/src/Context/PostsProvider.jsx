import React, {createContext, useState} from "react"

export const postsProvider = createContext();

export const PostsProvider = ({children}) =>{
    const [posts, setPosts] = useState({
        post_id: null,       
        user_id: null,       
        title: "",           
        content: "",         
        image_file: null,    
        image_name: "",      
        category: "",        
        status: "",          
        views: 0,            
        created_at: ""       
      });
      

    return (
<userProvider.Provider value={[posts, setPosts]}>
    {children}
</userProvider.Provider>
    );
};