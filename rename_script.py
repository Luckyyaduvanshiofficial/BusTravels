import os
import re

TARGET_DIR = r"d:\Bus Booking app\frontend"
EXCLUDE_DIRS = {'node_modules', '.next', '.git'}

def rename_contents(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replacements (Careful with Case)
        new_content = re.sub(r'\bdriver\b', 'operator', content)
        new_content = re.sub(r'\bDriver\b', 'Operator', new_content)
        new_content = re.sub(r'\bdrivers\b', 'operators', new_content)
        new_content = re.sub(r'\bDrivers\b', 'Operators', new_content)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated content in {filepath}")
    except Exception as e:
        print(f"Failed to read/write {filepath}: {e}")

def get_all_items(current_dir):
    items_to_rename_files = []
    items_to_rename_dirs = []
    files_to_modify = []
    
    for root, dirs, files in os.walk(current_dir, topdown=True):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for name in files:
            if name.endswith(('.tsx', '.ts', '.css', '.json', '.md')):
                files_to_modify.append(os.path.join(root, name))
            if 'driver' in name.lower():
                items_to_rename_files.append((root, name))
                
        for name in dirs:
            if 'driver' in name.lower() and name not in EXCLUDE_DIRS:
                items_to_rename_dirs.append((root, name))
                
    return files_to_modify, items_to_rename_files, items_to_rename_dirs

if __name__ == "__main__":
    files_to_modify, rename_files, rename_dirs = get_all_items(TARGET_DIR)
    
    print(f"Found {len(files_to_modify)} files to modify.")
    for f in files_to_modify:
        rename_contents(f)
        
    print(f"Found {len(rename_files)} files to rename.")
    for root, name in rename_files:
        new_name = name.replace('driver', 'operator').replace('Driver', 'Operator')
        if new_name != name:
            os.rename(os.path.join(root, name), os.path.join(root, new_name))
            print(f"Renamed file {name} to {new_name}")
            
    print(f"Found {len(rename_dirs)} dirs to rename.")
    # Rename dirs in reverse length order to avoid breaking paths
    rename_dirs.sort(key=lambda x: len(x[0]), reverse=True)
    for root, name in rename_dirs:
        new_name = name.replace('driver', 'operator').replace('Driver', 'Operator')
        if new_name != name:
            old_path = os.path.join(root, name)
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)
            print(f"Renamed directory {old_path} to {new_path}")
            
    print("FINISHED!")
