import ViewTransitionLink from "@/components/view-transition-link";

const AnimatedName = () => {
  return (
    <ViewTransitionLink
      to="/"
      className="transition-element fade-in mb-8 font-medium text-gray-400"
    >
      Windsor Nguyễn
    </ViewTransitionLink>
  );
};

export default AnimatedName;
