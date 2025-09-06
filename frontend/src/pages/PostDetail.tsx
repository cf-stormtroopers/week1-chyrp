// import { useRoute } from "wouter";

// export default function PostDetail() {
//   const [, params] = useRoute("/post/:id");
//   const { id } = params;  // 👈 grab the post id from URL

//   // Normally you'd fetch the post data from your backend or state
//   // For now, let’s mock it:
//   const post = {
//     id,
//     title: `Post ${id}`,
//     content: "This is the full content of the post."
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-black p-8">
//       <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-lg">
//         <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
//         <p className="text-lg leading-relaxed">{post.content}</p>
//       </div>
//     </div>
//   );
// }
