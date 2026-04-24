import { createClient } from "@supabase/supabase-js"

const url = "https://fqxdbdgewdzrdcsxzpsi.supabase.co/rest/v1/"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeGRiZGdld2R6cmRjc3h6cHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzAwOTIsImV4cCI6MjA5MjQ0NjA5Mn0.yvhO62D36ThpAOSPo91sLJu_HQYNKp4--iOmSk_CiQw"
    
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
           
            supabase.storage.from("items").upload(newName, file, {
                upsert:false,
                cacheControl:"3600"
            }).then(
                ()=>{
                    const publicUrl = supabase.storage.from("items").getPublicUrl(newName).data.publicUrl
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