class Utils:
    @staticmethod
    def get_images(paths: list[str]) -> dict[str, bytes]:
        """
        gets list of image names, extracts them from directory images and returns images
        """
        images = []
        for path in paths:
            with open(f'backend/static/images/{path}', 'rb') as image:
                # images[path] = image.read()
                img = image.read()
                print(img)
                images.append(img)
        return images

