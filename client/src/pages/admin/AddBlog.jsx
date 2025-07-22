import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    subTitle: "",
    category: "All",
    isPublished: false,
  });

  const [image, setImage] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { axios } = useAppContext();

  // const [title, setTitle] = useState('')
  // const [subTitle, setSubTitle] = useState('')
  // const [category, setCategory] = useState('All')
  // const [isPublished, setIsPublished] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const blog = { ...form, description: quillRef.current.root.innerHTML };
      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const res = await axios.post("/api/blog/add", formData);
      toast.success(res.data.message);
      setForm({
        title: "",
        subTitle: "",
        category: "All",
        isPublished: false,
      });
      quillRef.current.root.innerHTML = "";
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsAdding(false);
    }
  };

 const PROMPT_SECTIONS = [
  {
    label: "Introduction",
    instr:
      "Write a 4–6 sentence engaging intro that hooks the reader in simple text format.",
  },
  {
    label: "Main Section 1",
    instr:
      "Write strictly in 100 words at maximum with a subheading explaining the first key point in simple text format.",
  },
  {
    label: "Main Section 2",
    instr:
      "Write strictly in 100 words at maximum under a subheading covering the second key point in simple text format.",
  },
  {
    label: "Main Section 3",
    instr:
      "Write strictly in 100 words at maximum under a subheading covering the third key point in simple text format.",
  },
  {
    label: "Conclusion",
    instr:
      "Write strictly between a 2–3 sentence concluding paragraph with a call-to-action in simple text format.",
  },
];
  const generateContent = async () => {
    if (!form.title) return toast.error("Enter a title");

    let full = "";
    setGenerating(true);

    for (let part = 0; part < PROMPT_SECTIONS.length; part++) {
      toast(`Building...`);
      try {
        const { data } = await axios.post("/api/blog/generate", {
          prompt: form.title,
          part,
        });
        full += part === 0 ? data.content : `\n\n${data.content}`;
        quillRef.current.root.innerHTML = parse(full);
      } catch (err) {
        toast.error(`Failed to generate try again!`);
        break;
      }
    }

    setGenerating(false);
    toast.success("Blog generated!");
  };

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt="upload"
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          value={form.title}
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
          }}
        />

        <p className="mt-4">Sub Title</p>
        <input
          value={form.subTitle}
          type="text"
          placeholder="Type here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => {
            setForm({ ...form, subTitle: e.target.value });
          }}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {generating && (
            <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2">
              <div className="size-8 rounded-full border-2 border-t-white animate-spin"></div>
            </div>
          )}
          <button
            disabled={generating}
            className={`absolute bottom-1 right-2 ml-2 text-xs text-white ${
              generating ? "bg-black/40" : "bg-black/70 hover:underline"
            } px-4 py-1.5 rounded cursor-pointer`}
            type="button"
            onClick={generateContent}
          >
            {generating ? "Generating...." : "Generate with AI"}
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          value={form.category || ""}
          onChange={(e) => {
            setForm({ ...form, category: e.target.value });
          }}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="" disabled hidden>
            Select Category
          </option>
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            onChange={(e) => {
              setForm({ ...form, isPublished: e.target.checked });
            }}
            type="checkbox"
            checked={form.isPublished}
            className="scale-125 cursor-pointer"
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className={`mt-8 w-40 h-10 ${
            isAdding ? "bg-primary/80" : "bg-primary"
          } text-white rounded cursor-pointer text-sm`}
        >
          {isAdding ? "Adding...." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
