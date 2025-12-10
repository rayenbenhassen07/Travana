<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // You can add more specific authorization logic here
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $blogId = $this->route('id');
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            // Basic Information
            'title' => $isUpdate ? 'sometimes|string|max:255' : 'required|string|max:255',
            'slug' => $isUpdate 
                ? 'sometimes|string|unique:blogs,slug,' . $blogId 
                : 'nullable|string|unique:blogs,slug',
            'excerpt' => 'nullable|string|max:500',
            'content' => $isUpdate ? 'sometimes|string' : 'required|string',
            
            // Media
            'main_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB
            'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048', // 2MB
            
            // Author
            'author_id' => $isUpdate ? 'sometimes|exists:users,id' : 'required|exists:users,id',
            
            // Categories & Tags
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:blog_tags,id',
            
            // SEO Fields
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            
            // Publishing Controls (WordPress-style)
            'published_at' => 'nullable|date', // NULL = draft, future = scheduled, past/now = published
            
            // Additional Features
            'is_featured' => 'nullable|boolean',
            'allow_comments' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Blog title is required',
            'title.max' => 'Blog title cannot exceed 255 characters',
            'content.required' => 'Blog content is required',
            'author_id.required' => 'Author is required',
            'author_id.exists' => 'Selected author does not exist',
            'main_image.image' => 'Main image must be an image file',
            'main_image.max' => 'Main image size cannot exceed 5MB',
            'thumbnail.image' => 'Thumbnail must be an image file',
            'thumbnail.max' => 'Thumbnail size cannot exceed 2MB',
            'meta_description.max' => 'Meta description cannot exceed 500 characters',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'category_ids' => 'categories',
            'tag_ids' => 'tags',
            'author_id' => 'author',
            'main_image' => 'main image',
            'meta_title' => 'SEO title',
            'meta_description' => 'SEO description',
            'meta_keywords' => 'SEO keywords',
        ];
    }
}
