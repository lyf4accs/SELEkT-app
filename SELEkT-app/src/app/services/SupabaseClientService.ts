import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "../utils/config";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root',
})
export class SupabaseClientService{
 supabaseUrl = SUPABASE_URL;
 supabaseKey = SUPABASE_KEY;
  supabase = createClient(this.supabaseUrl, this.supabaseKey);
}
