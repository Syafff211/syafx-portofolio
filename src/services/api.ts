import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Education, Experience, Message, Profile, Project, SiteSettings, Skill, SocialMedia } from '../types/portfolio'
import * as seed from '../data/portfolio'

const fail = () => { throw new Error('Supabase belum dikonfigurasi. Salin .env.example menjadi .env.local lalu isi URL dan publishable key.') }
const db = () => { if (!supabase) fail(); return supabase! }

export const api = {
  async profile():Promise<Profile>{ const {data,error}=await db().from('profiles').select('*').limit(1).single(); if(error) throw error; return mapProfile(data) },
  async skills():Promise<Skill[]>{ const {data,error}=await db().from('skills').select('*').order('display_order'); if(error) throw error; return (data??[]).map(mapSkill) },
  async projects():Promise<Project[]>{ const {data,error}=await db().from('projects').select('*').order('display_order'); if(error) throw error; return (data??[]).map(mapProject) },
  async experience():Promise<Experience[]>{ const {data,error}=await db().from('experiences').select('*').order('display_order'); if(error) throw error; return (data??[]).map(mapExperience) },
  async education():Promise<Education[]>{ const {data,error}=await db().from('education').select('*').order('display_order'); if(error) throw error; return (data??[]).map(mapEducation) },
  async socials():Promise<SocialMedia[]>{ const {data,error}=await db().from('social_media').select('*').order('display_order'); if(error) throw error; return (data??[]).map(mapSocial) },
  async settings():Promise<SiteSettings>{ const {data,error}=await db().from('site_settings').select('*').limit(1).single(); if(error) throw error; return mapSettings(data) },
  async messages():Promise<Message[]>{ const {data,error}=await db().from('messages').select('*').order('created_at',{ascending:false}); if(error) throw error; return (data??[]).map(mapMessage) },
  async sendMessage(m:Omit<Message,'id'|'status'|'createdAt'>){ const {error}=await db().from('messages').insert({name:m.name,email:m.email,subject:m.subject,message:m.message}); if(error) throw error },
  async updateProfile(profile:Profile){ const {error}=await db().from('profiles').update(toProfile(profile)).eq('id',profile.id); if(error) throw error },
  async saveSkill(s:Partial<Skill> & {id?:string}){ const payload=toSkill(s); if(s.id){const {data,error}=await db().from('skills').update(payload).eq('id',s.id).select().single();if(error)throw error;return mapSkill(data)} const {data,error}=await db().from('skills').insert(payload).select().single();if(error)throw error;return mapSkill(data) },
  async deleteSkill(id:string){const {error}=await db().from('skills').delete().eq('id',id);if(error)throw error},
  async saveProject(p:Partial<Project> & {id?:string}){const payload=toProject(p);if(p.id){const {data,error}=await db().from('projects').update(payload).eq('id',p.id).select().single();if(error)throw error;return mapProject(data)}const {data,error}=await db().from('projects').insert(payload).select().single();if(error)throw error;return mapProject(data)},
  async deleteProject(id:string){const {error}=await db().from('projects').delete().eq('id',id);if(error)throw error},
  async saveExperience(e:Partial<Experience> & {id?:string}){const payload=toExperience(e);if(e.id){const {data,error}=await db().from('experiences').update(payload).eq('id',e.id).select().single();if(error)throw error;return mapExperience(data)}const {data,error}=await db().from('experiences').insert(payload).select().single();if(error)throw error;return mapExperience(data)},
  async deleteExperience(id:string){const {error}=await db().from('experiences').delete().eq('id',id);if(error)throw error},
  async saveEducation(e:Partial<Education> & {id?:string}){const payload=toEducation(e);if(e.id){const {data,error}=await db().from('education').update(payload).eq('id',e.id).select().single();if(error)throw error;return mapEducation(data)}const {data,error}=await db().from('education').insert(payload).select().single();if(error)throw error;return mapEducation(data)},
  async deleteEducation(id:string){const {error}=await db().from('education').delete().eq('id',id);if(error)throw error},
  async updateMessage(id:string,status:Message['status']){const {error}=await db().from('messages').update({status}).eq('id',id);if(error)throw error},
  async deleteMessage(id:string){const {error}=await db().from('messages').delete().eq('id',id);if(error)throw error},
  async saveSocial(s:Partial<SocialMedia> & {id?:string}){const payload=toSocial(s);if(s.id){const {data,error}=await db().from('social_media').update(payload).eq('id',s.id).select().single();if(error)throw error;return mapSocial(data)}const {data,error}=await db().from('social_media').insert(payload).select().single();if(error)throw error;return mapSocial(data)},
  async deleteSocial(id:string){const {error}=await db().from('social_media').delete().eq('id',id);if(error)throw error},
  async saveSettings(s:SiteSettings){const {error}=await db().from('site_settings').update(toSettings(s)).eq('id',s.id);if(error)throw error},
  seed,
  configured:isSupabaseConfigured,
}

const mapProfile=(r:any):Profile=>({id:r.id,name:r.name,title:r.title,headline:r.headline,bio:r.bio,avatar:r.avatar??'',email:r.email??'',phone:r.phone??'',location:r.location??'',cvUrl:r.cv_url??'',availability:r.availability,about:r.about??''})
const mapSkill=(r:any):Skill=>({id:r.id,name:r.name,category:r.category,icon:r.icon??'Code2',level:r.level,order:r.display_order,published:r.published})
const mapProject=(r:any):Project=>({id:r.id,title:r.title,slug:r.slug,thumbnail:r.thumbnail??'',gallery:r.gallery??[],description:r.description??'',content:r.content??'',category:r.category,technologies:r.technologies??[],liveUrl:r.live_url??'',githubUrl:r.github_url??'',featured:r.featured,published:r.published,projectDate:r.project_date,createdAt:r.created_at,updatedAt:r.updated_at})
const mapExperience=(r:any):Experience=>({id:r.id,position:r.position,company:r.company,location:r.location??'',startDate:r.start_date,endDate:r.end_date,current:r.current,description:r.description??'',technologies:r.technologies??[],order:r.display_order,published:r.published})
const mapEducation=(r:any):Education=>({id:r.id,institution:r.institution,degree:r.degree,field:r.field??'',startDate:r.start_date,endDate:r.end_date,description:r.description??'',logo:r.logo??'',order:r.display_order,published:r.published})
const mapMessage=(r:any):Message=>({id:r.id,name:r.name,email:r.email,subject:r.subject,message:r.message,status:r.status,createdAt:r.created_at})
const mapSocial=(r:any):SocialMedia=>({id:r.id,platform:r.platform,url:r.url,icon:r.icon??'Globe',active:r.active,order:r.display_order})
const mapSettings=(r:any):SiteSettings=>({id:r.id,siteTitle:r.site_title,siteDescription:r.site_description,favicon:r.favicon??'',logo:r.logo??'',darkMode:r.dark_mode,lightMode:r.light_mode,primaryColor:r.primary_color,accentColor:r.accent_color,metaTitle:r.meta_title,metaDescription:r.meta_description,keywords:r.keywords??[],ogImage:r.og_image??'',email:r.email??'',whatsapp:r.whatsapp??'',location:r.location??''})
const toProfile=(p:Profile)=>({name:p.name,title:p.title,headline:p.headline,bio:p.bio,avatar:p.avatar,email:p.email,phone:p.phone,location:p.location,cv_url:p.cvUrl,availability:p.availability,about:p.about})
const toSkill=(s:Partial<Skill>)=>({name:s.name,category:s.category,icon:s.icon,level:s.level??null,display_order:s.order??0,published:s.published??false})
const toProject=(p:Partial<Project>)=>({title:p.title,slug:p.slug,thumbnail:p.thumbnail,gallery:p.gallery??[],description:p.description,content:p.content,category:p.category,technologies:Array.isArray(p.technologies)?p.technologies:String(p.technologies??'').split(',').map(x=>x.trim()).filter(Boolean),live_url:p.liveUrl,github_url:p.githubUrl,featured:p.featured??false,published:p.published??false,project_date:p.projectDate??null,display_order:(p as any).order??0})
const toExperience=(e:Partial<Experience>)=>({position:e.position,company:e.company,location:e.location,start_date:e.startDate,end_date:e.current?null:e.endDate,current:e.current??false,description:e.description,technologies:Array.isArray(e.technologies)?e.technologies:String(e.technologies??'').split(',').map(x=>x.trim()).filter(Boolean),display_order:e.order??0,published:e.published??false})
const toEducation=(e:Partial<Education>)=>({institution:e.institution,degree:e.degree,field:e.field,start_date:e.startDate,end_date:e.endDate,description:e.description,logo:e.logo,display_order:e.order??0,published:e.published??false})
const toSocial=(s:Partial<SocialMedia>)=>({platform:s.platform,url:s.url,icon:s.icon,active:s.active??true,display_order:s.order??0})
const toSettings=(s:SiteSettings)=>({site_title:s.siteTitle,site_description:s.siteDescription,favicon:s.favicon,logo:s.logo,dark_mode:s.darkMode,light_mode:s.lightMode,primary_color:s.primaryColor,accent_color:s.accentColor,meta_title:s.metaTitle,meta_description:s.metaDescription,keywords:s.keywords,og_image:s.ogImage,email:s.email,whatsapp:s.whatsapp,location:s.location})
