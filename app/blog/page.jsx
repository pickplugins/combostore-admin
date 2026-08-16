
import Link from "next/link";
import Image from "next/image";
import React from "react";
// import BlogArchive from "/components/BlogArchive";




const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;






export async function generateMetadata({ searchParams }) {



	var term = "";

	if (searchParams.tag) {
		term = searchParams.tag; // 👈 gets ?tag=baby-care
	}
	if (searchParams.category) {
		term = searchParams.category; // 👈 gets ?category=baby-care
	}





	var pageMetaData = {

		title: `Blog - KidoBazar`,
		description: "Explore the Kidobazar Blog for shopping tips, product guides, lifestyle inspiration, and the latest updates to make your everyday life smarter.",
		post_thumbnail: { src: "", alt: "" },
		keywords: "Kidobazar, kids online store, baby products, children’s toys, kids fashion, baby clothes, kids essentials, kids marketplace, buy baby toys online, kids shop",
		ogTitle: `Blog - KidoBazar`,
		ogDes: "Explore the Kidobazar Blog for shopping tips, product guides, lifestyle inspiration, and the latest updates to make your everyday life smarter."

	}



	return {
		title: pageMetaData.title,
		description: pageMetaData.description?.slice(0, 160),
		openGraph: {
			title: pageMetaData.ogTitle,
			description: pageMetaData.post_excerpt?.slice(0, 160),
			url: `${appUrl}product/`,
			images: [{ url: pageMetaData.post_thumbnail?.src, alt: pageMetaData.ogTitle }],
		},
		twitter: {
			card: "summary_large_image",
			title: pageMetaData.ogTitle,
			description: pageMetaData.post_excerpt?.slice(0, 160),
			images: [pageMetaData.post_thumbnail?.src],
		},
	};
}









var postData = {
	per_page: 15,
	paged: 1,
	order: "DESC",
	keyword: "",
};
postData = JSON.stringify(postData);

const res = await fetch(`${serverUrl}wp-json/combo-store/v2/get_posts`, {
	method: "POST",
	cache: "no-store", // disables caching

	headers: {
		'Content-Type': 'application/json',
	},
	body: postData,
});


const data = await res.json();






export default async function page({ params }) {
	// const token = useAuthStore((state) => state.token);
	// const { wrapCurrency, priceHtml } = useUtilsStore()

	// const router = useRouter();
	// const searchParams = useSearchParams(); // like location.search

	const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
	// const { appData, notifications, addNotification, cartItems, addCartItems, removeCartItems, resetCartItems, updateCartItems, userDataX, setUserDataX } = useCounterStore()



	// var [appData, setappData] = useState(window.appData);





	var promptsData = { posts: data?.posts, total: data?.total, maxPages: data?.max_pages };



	return (

		<div>

			<div className="flex justify-between px-5 py-3">

				{JSON.stringify(promptsData)}


			</div>
			{/* <BlogArchive
				entries={promptsData}

			/> */}
		</div>



	);
};

