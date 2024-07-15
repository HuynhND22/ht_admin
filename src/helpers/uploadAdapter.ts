import { FileLoader } from '@ckeditor/ckeditor5-upload';
import axiosClient from '../configs/axiosClient'

class UploadAdapter {
    private loader: FileLoader;

    constructor(loader: FileLoader) {
        this.loader = loader;
    }

    async upload(): Promise<{ default: string }> {
      try {
        const file:any = await this.loader.file;
        const formData = new FormData();
        formData.append('images', file);

        const response = await axiosClient.post(
          `/uploads/posts`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        return {
          default: response.data[0].url
        };

      } catch (error) {
        console.error('Upload failed:', error);
        throw error;
      }
    }

    abort(): void {
        // Xử lý việc hủy upload nếu cần
    }
}

export function uploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
        return new UploadAdapter(loader);
    };
}