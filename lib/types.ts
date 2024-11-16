export interface Link {
    name: string;
    url: string;
  }
  
  export interface ColorSchema {
    primary: string;
    secondary: string;
    text: string;
  }
  export interface CollapseBlockSetting extends CommonSettings {
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
    contentColor1?: string;
    contentColor2?: string;
    contentColor3?: string;
    contentColor4?: string;
  }
  
// New specific interfaces for Collapse component
export interface CollapseBlock {
  heading?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  content1?: string;
  content2?: string;
  content3?: string;
  content4?: string;
  setting: CollapseBlockSetting;
  links: Link[];
}

export interface CollapseSection {
  blocks: CollapseBlock[];
  setting: CollapseSettings;
  type: 'collapse';
}

interface CollapseSettings {
  background?: string;
  headingColor?: string;
  headingFontWeight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
}

  
  export interface CommonSettings {
    headingFontSize: any;
    formBackground: any;
    textColor?: string;
    btnTextColor?: string;
    imageWidth?: string;
    imageHeight?: string;
    opacityImage?: string;
    heading?: string;
    titleColor?: string;
    descriptionColor?: string;
    backgroundColorBox?: string;
    btnColor?: string;
    btnBackgroundColor?: string;
    imageBehavior?: string;
    imageRadious?: string;
    headingColor?: string;
    background?: string;
    headingFontWeight?: string;
    paddingTop?: string;
    paddingBottom?: string;
    marginTop?: string;
    marginBottom?: string;
    textFontSize?: string;
    textFontWeight?: string;
    descriptionFontSize?: string;
    descriptionFontWeight?: string;
    btnTextFontSize?: string;
    btnTextFontWeight?: string;
    imageSrc? : string;
    text1?: string;
    text2?: string;
    text3?: string;
    text4?: string;
    content1?: string;
    content2?: string;
    content3?: string;
    content4?: string;
    setting: CollapseBlockSetting;
    }
  
    export interface HeaderBlockSettings extends CommonSettings {
      imageWidth: string;
      imageHeight: string;
      imageRadius: string;
      itemColor: string;
      itemFontSize: string;
      itemFontWeight: string;
      itemHoverColor: string;
      backgroundColorNavbar: string;
      titleColor: string;
    }
    export interface HeaderBlock {
      imageLogo: string;
      imageAlt: string;
      links: Link[];
      setting: HeaderBlockSettings;
    }
    
  
    export interface HeaderSection {
      type: "header";
      blocks: HeaderBlock;
      setting: CommonSettings & {
        navbarPosition: string;
        paddingTop: string;
        paddingBottom: string;
        marginBottom: string;
      };
    }
  export interface BannerSection {
    blocks: {
      imageSrc: string;
      imageAlt: string;
      text: string;
      description: string;
      imageLink?: string;
      setting: CommonSettings;
    };
    setting: CommonSettings;
  }
  
  export interface BlockSetting {
    [key: number]: string | number | boolean | CommonSettings;
  }
  // Add these new interfaces for MultiColumn component
export interface MultiColumnBlockSetting extends CommonSettings {
  headingColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  backgroundColorBox?: string;
  btnColor?: string;
  btnBackgroundColor?: string;
  imageBehavior?: string;
  imageRadious?: string;
}

export interface MultiColumnBlock {
  title1?: string;
  title2?: string;
  title3?: string;
  description1?: string;
  description2?: string;
  description3?: string;
  imageSrc1?: string;
  imageSrc2?: string;
  imageSrc3?: string;
  btnLable1?: string;
  btnLable2?: string;
  btnLable3?: string;
  btnLink1?: string;
  btnLink2?: string;
  btnLink3?: string;
}
// Add these new interfaces for Newsletter component
export interface NewsLetterBlockSetting extends CommonSettings {
  headingColor: string;
  headingFontSize: string;
  headingFontWeight: string;
  descriptionColor: string;
  descriptionFontSize: string;
  descriptionFontWeight: string;
  btnTextColor: string;
  btnBackgroundColor: string;
  formBackground: string;
}

export interface NewsLetterBlock {
  heading: string;
  description: string;
  btnText: string;
  setting: NewsLetterBlockSetting;
}

export interface NewsLetterSection {
  blocks: NewsLetterBlock;
  setting: CommonSettings;
  type: 'newsletter';
}
// Add these new interfaces for RichText component
export interface RichTextBlockSetting extends CommonSettings {
  textHeadingColor?: string;
  textHeadingFontSize?: string;
  textHeadingFontWeight?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  descriptionFontWeight?: string;
  btnTextColor?: string;
  btnBackgroundColor?: string;
  background?: string;
  allTextPosition?: string;
}

export interface RichTextBlock {
  textHeading?: string;
  description?: string;
  btnText?: string;
  btnLink?: string;
  setting: RichTextBlockSetting;
}

export interface RichTextSection {
  blocks: RichTextBlock;
  setting: CommonSettings;
  type: 'rich-text';
}

export interface MultiColumnSection {
  blocks: {
    [key: number]: MultiColumnBlock;
  };
  setting: MultiColumnBlockSetting;
  type: 'multicolumn';
}

  export interface Section {
    setting: CommonSettings;
    blocks: HeaderBlock | CollapseBlock| ImageTextBlock ;
    type: string;
  }
  export interface ImageTextBlockSetting extends CommonSettings {
    headingColor: string;
    headingFontSize: string;
    headingFontWeight: string;
    descriptionColor: string;
    descriptionFontSize: string;
    descriptionFontWeight: string;
    btnTextColor: string;
    btnBackgroundColor: string;
    backgroundColorBox: string;
    backgroundBoxOpacity: string;
    boxRadiuos: string;
    opacityImage: string;
    imageWidth: string;
    imageHeight: string;
    background: string;
  }
  
  // Add this new interface for ImageText blocks
  export interface ImageTextBlock {
    imageSrc: string;
    imageAlt: string;
    heading: string;
    description: string;
    btnLink: string;
    btnText: string;
    setting: ImageTextBlockSetting;
  }
  
  // Add this new interface for ImageText section
  export interface ImageTextSection {
    blocks: ImageTextBlock;
    setting: CommonSettings;
    type: 'image-text';
  }
   
  
  export interface FooterSection {
    settings: {
      text: string;
    };
  }
  
  export interface Children {
    type: string;
    sections: Section[];
    order: string[];
  }  
 export  interface Layout {
    setting: {};
    blocks: string;
    type: "layout";
    settings: {
      fontFamily: string;
      colorSchema: ColorSchema;
    };
    sections: {
      slideshow: string;
      sectionHeader: HeaderSection;
      children: Children;
      sectionFooter: FooterSection;
      sectionImageText: string;
      banner: string;
    };
    order: string[];
  }
  