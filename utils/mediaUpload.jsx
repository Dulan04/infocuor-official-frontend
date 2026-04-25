import { createClient } from "@supabase/supabase-js"

const url = "https://tarmbrwocwouasmjvlrr.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcm1icndvY3dvdWFzbWp2bHJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MjY1NzEsImV4cCI6MjA5MjEwMjU3MX0.2bnE-ovlg4kmYy-i7iu61G68VaD3XwnqeHPpx4H7Pqc"
    
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