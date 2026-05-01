import { createClient } from "@supabase/supabase-js"

const url = "https://xjepxmzmrwcddemewlmv.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZXB4bXptcndjZGRlbWV3bG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMDQ4MzQsImV4cCI6MjA5MjY4MDgzNH0.-UbuvzY6t8jW_D0F3XJixHcufSsnaMHM9pAsF30-NIw"
    
const supabase = createClient(url,key)

export default function mediaUpload(file){

    const mediaUploadPromise = new Promise(
        (resolve, reject)=>{
            
            if(file == null){
                reject("No file Selected");
                return
            }
            
        
            const timestamp = new Date().getTime()
            const newName = timestamp+file.name
           
            supabase.storage.from("images").upload(newName, file, {
                upsert:false,
                cacheControl:"3600"
            }).then(
                ()=>{
                    const publicUrl = supabase.storage.from("images").getPublicUrl(newName).data.publicUrl
                    resolve(publicUrl);
                }
            ).catch(
                ()=>{
                    reject("Error occured superbase connection")
                }
            )
        }  

    )

    return mediaUploadPromise;

}