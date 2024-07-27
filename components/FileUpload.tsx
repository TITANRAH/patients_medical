import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import Image from 'next/image'
import { convertFileToUrl } from '@/lib/utils'


interface Props {
    files: File[] | undefined,
    onChange: (file: File[]) => void
}

function FileUpload(props: Props) {

    const {files, onChange} = props

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    onChange(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} className='file-upload' >
      <input {...getInputProps()} />

      {files && files?.length > 0 ? (
        <Image
            src={convertFileToUrl(files[0])}
            width={1000}
            height={1000}
            alt='upload'
            className='max-h-[400px] overflow-hidden object-cover'
        />
      ) : (
        <>
         <Image
            src="/assets/icons/upload.svg"
            width={40}
            height={40}
            alt='upload'
        />

        <div className='file-upload_label'>
            <p className='text-14-regular '>

                Click para <span> subir </span> o arrastra 
            </p>
            <p>
                SVG, PNG, JPG, o GIF(max 800X400 )
            </p>
        </div>
        </>

      )}
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default FileUpload