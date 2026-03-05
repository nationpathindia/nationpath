import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(){

try{

/* ================= TIME WINDOWS ================= */

const today = new Date()
today.setHours(0,0,0,0)

const weekAgo = new Date()
weekAgo.setDate(weekAgo.getDate()-7)

const day24 = new Date()
day24.setDate(day24.getDate()-1)

/* ================= ARTICLES ================= */

const totalArticles = await prisma.article.count()

const pendingArticles = await prisma.article.count({
where:{ status:"pending" }
})

const drafts = await prisma.article.count({
where:{ status:"draft" }
})

const publishedToday = await prisma.article.count({
where:{
status:"approved",
createdAt:{ gte: today }
}
})

const weekArticles = await prisma.article.count({
where:{
status:"approved",
createdAt:{ gte: weekAgo }
}
})

/* ================= USERS ================= */

const totalUsers = await prisma.user.count()

/* ================= COMMENTS ================= */

const totalComments = await prisma.comment.count()

/* ================= VIEWS ================= */

const totalViewsAgg = await prisma.article.aggregate({
_sum:{ views:true }
})

const totalViews = totalViewsAgg._sum.views || 0

/* ================= ADS ================= */

const activeAds = await prisma.ad.count({
where:{ status:"active" }
})

const adViewsAgg = await prisma.ad.aggregate({
_sum:{ views:true }
})

const adClicksAgg = await prisma.ad.aggregate({
_sum:{ clicks:true }
})

const adViews = adViewsAgg._sum.views || 0
const adClicks = adClicksAgg._sum.clicks || 0

/* ================= LATEST ARTICLES ================= */

const latest = await prisma.article.findMany({
where:{ status:"approved", isDeleted:false },
orderBy:{ createdAt:"desc" },
take:5,
select:{
id:true,
title:true,
views:true,
createdAt:true
}
})

/* ================= MOST VIEWED ================= */

const top = await prisma.article.findMany({
where:{ status:"approved", isDeleted:false },
orderBy:{ views:"desc" },
take:5,
select:{
id:true,
title:true,
views:true
}
})

/* ================= TRENDING ================= */

const trending = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
lastViewAt:{ gte: day24 }
},
orderBy:{ trendingScore:"desc" },
take:5,
select:{
id:true,
title:true,
views:true,
trendingScore:true
}
})

/* ================= VIRAL ================= */

const viral = await prisma.article.findMany({
where:{
status:"approved",
isDeleted:false,
views:{ gt:500 }
},
orderBy:{ views:"desc" },
take:5,
select:{
id:true,
title:true,
views:true
}
})

/* ================= ACTIVITY LOG ================= */

const activityRaw = await prisma.activityLog.findMany({
orderBy:{ createdAt:"desc" },
take:10,
include:{
user:{
select:{
name:true,
email:true
}
}
}
})

const activity = activityRaw.map(a=>({
id:a.id,
title:a.action,
user:a.user?.name || "System",
time:new Date(a.createdAt).toLocaleDateString()
}))

/* ================= TRAFFIC CHART ================= */

const weekData = await prisma.article.findMany({
where:{
createdAt:{ gte: weekAgo }
},
select:{
createdAt:true,
views:true
}
})

const chartMap:any = {}

weekData.forEach(a=>{

const day = new Date(a.createdAt)
.toLocaleDateString("en-US",{weekday:"short"})

if(!chartMap[day]) chartMap[day]=0

chartMap[day]+=a.views

})

const chart = Object.keys(chartMap).map(day=>({
day,
views:chartMap[day]
}))

/* ================= CATEGORY CHART ================= */

const categories = await prisma.category.findMany({
include:{
articles:{
where:{ status:"approved", isDeleted:false },
select:{ id:true }
}
}
})

const categoriesChart = categories
.map(c=>({
name:c.name,
count:c.articles.length
}))
.sort((a,b)=>b.count-a.count)
.slice(0,6)

/* ================= RESPONSE ================= */

return NextResponse.json({

stats:{
totalArticles,
pendingArticles,
totalUsers,
totalComments,
totalViews,
activeAds,
drafts,
publishedToday,
weekArticles,
adViews,
adClicks
},

latest,
top,
trending,
viral,
activity,
chart,
categories: categoriesChart

})

}catch(error){

console.error("Dashboard API error",error)

return NextResponse.json(
{error:"Dashboard failed"},
{status:500}
)

}

}