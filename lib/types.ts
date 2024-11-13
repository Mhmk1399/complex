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
    opacityImage: any;
    heading: any;
    titleColor: any;
    descriptionColor: any;
    backgroundColorBox: any;
    btnColor: any;
    btnBackgroundColor: any;
    imageBehavior: any;
    imageRadious: any;
    headingColor: any;
    background: any;
    headingFontWeight: any;
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
    [key: string]: string | number | boolean;
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
      [key: string]: any;
      setting: BlockSetting;
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
    setting: any;
    blocks: any;
    type: "layout";
    settings: {
      fontFamily: string;
      colorSchema: ColorSchema;
    };
    sections: {
      sectionHeader: HeaderSection;
      children: Children;
      sectionFooter: FooterSection;
    };
    order: string[];
  }
  