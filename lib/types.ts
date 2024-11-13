export interface Link {
    name: string;
    url: string;
  }
  
  export interface ColorSchema {
    primary: string;
    secondary: string;
    text: string;
  }
  
  export interface CommonSettings {
    textColor: string;
    btnTextColor: string;
    imageWidth: string;
    imageHeight: string;
    opacityImage: string;
    heading: string;
    titleColor: string;
    descriptionColor: string;
    backgroundColorBox: string;
    btnColor: string;
    btnBackgroundColor: string;
    imageBehavior: string;
    imageRadious: string;
    headingColor: string;
    background: string;
    headingFontWeight: string;
    paddingTop: string;
    paddingBottom: string;
    marginTop: string;
    marginBottom: string;
  }
  
  export interface HeaderBlockSettings {
    imageWidth: string;
    imageHeight: string;
    imageRadius: string;
    itemColor: string;
    itemFontSize: string;
    itemFontWeight: string;
    itemHoverColor: string;
    backgroundColorNavbar: string;
  }
  
  export interface HeaderSection {
    type: "header";
    blocks: {
      imageLogo: string;
      imageAlt: string;
      links: Link[];
      setting: HeaderBlockSettings;
    };
    setting: CommonSettings & {
      navbarPosition: string;
    };
  }
  
  export interface BlockSetting {
    [key: number]: string | number | boolean | CommonSettings;
  }
  
  export interface Section {
    imageSrc: string;
    imageAlt: string;
    text: string;
    description: string;
    btnText: string;
    btnLink: string;
    type: string;
    blocks: {
      heading: string;
      videoUrl: string;
      videoAlt: string;
      [key: number]: string | number | boolean | CommonSettings;
      setting: BlockSetting | CommonSettings;
    };
    setting: CommonSettings;
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
    setting: string;
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
    };
    order: string[];
  }
  