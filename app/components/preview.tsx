import React from 'react'


interface PreviewProps {
  layout: {};
  setSelectedComponent: (component: string) => void;
}

export const Preview: React.FC<PreviewProps> = ({ layout, setSelectedComponent }) => {
  
  return (
    <div className="w-full md:w-full lg:w-[75%] h-[95vh] border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide lg:mt-5 lg:ml-5">
      Preview
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam voluptatibus libero accusamus dolorum blanditiis dolor cumque, deleniti magni illo accusantium consequatur ducimus tempore quos voluptates fugiat vero ratione corporis dolorem?
      <div className='bg-slate-400 w-[20px] mx-auto h-[1000px] rounded-full my-2'></div>
    </div>
  )
}
