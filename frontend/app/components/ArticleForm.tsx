"use client";

import { articlesApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticleForm() {
	const router = useRouter();
	const params = useParams();

	const articleId = params.id;
	const isEditing = !!articleId;

	const [article, setArticle] = useState({
		title: "",
		body: "",
		published: false,
	});
	const [error, setError] = useState(false);

	useEffect(() => {
		if (isEditing && articleId) {
			// Fetch the article
			articlesApi.getOne(articleId).then((data) => setArticle(data));
		}
	}, [articleId, isEditing]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			if (isEditing) {
				const result = await articlesApi.update(articleId, article);
			} else {
				const result = await articlesApi.create(article);
			}
			router.push("/");
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-4xl font-bold">
					{isEditing ? "Edit" : "Create"} Article
				</h1>
			</div>
			<Link
				href="/"
				className="my-2 text-blue-500 font-semibold transition-colors"
			>
				Home
			</Link>
			<form className="px-8 py-6 mb-4" onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm font-bold mb-2" htmlFor="title">
						Title
					</label>
					<input
						className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
						id="title"
						type="text"
						required
						value={article.title}
						onChange={(e) => setArticle({ ...article, title: e.target.value })}
						placeholder="Article Title"
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-bold mb-2" htmlFor="body">
						Body
					</label>
					<textarea
						className="shadow appearance-none border rounded w-full min-h-48 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
						id="body"
						required
						value={article.body}
						onChange={(e) => setArticle({ ...article, body: e.target.value })}
						placeholder="Article Body"
					/>
				</div>
				<div className="mb-4 flex items-center space-x-2">
					<input
						type="checkbox"
						name="published"
						checked={article.published}
						onChange={(e) =>
							setArticle({ ...article, published: e.target.checked })
						}
					/>
					<label className="block text-sm font-bold" htmlFor="body">
						Published
					</label>
				</div>
				<div className="my-4 flex items-center justify-end">
					<button
						className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="submit"
					>
						{isEditing ? "Update" : "Create"} Article
					</button>
				</div>
				{error && (
					<div className="mb-4">
						<p className="bg-white rounded p-2 mb-4 text-red-500"> {error} </p>
					</div>
				)}
			</form>
		</div>
	);
}
